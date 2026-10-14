import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ApiError } from "../api/client";
import type { AdminUserDTO, AudiencePreview, UUID } from "../api/types";
import { useApi } from "../auth/auth";
import { ConfirmSheet } from "../components/ConfirmSheet";
import { NotificationPreview } from "../components/NotificationPreview";
import { PillButton } from "../components/PillButton";
import { SearchDropdown } from "../components/SearchDropdown";
import { SegmentEditor } from "../components/SegmentEditor";
import { useToast } from "../components/Toast";
import { BODY_MAX, DESTINATIONS, EMPTY_FORM, TITLE_MAX, toInput, validate, type ComposeForm } from "../lib/campaign";
import { countChars, formatCount, seoulLocalFromNow, seoulLocalToIso } from "../lib/format";

const DRAFT_KEY = "syncrun-admin.compose-draft";

/** 쓰던 문구는 이 탭 안에서만 임시로 남긴다 — 로그인이 풀려도 다시 들어오면 되살아난다. */
function loadDraft(): ComposeForm | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY_FORM, ...(JSON.parse(raw) as Partial<ComposeForm>) } : null;
  } catch {
    return null;
  }
}

function saveDraft(form: ComposeForm | null) {
  try {
    if (form) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    else sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // 저장소를 못 쓰면 임시 보관만 빠진다.
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "EMPTY_AUDIENCE") return "받을 사람이 없어요. 조건을 바꿔 주세요";
    if (error.code === "CONFLICT") return "이미 예약했거나 보낸 알림이에요";
    if (error.code === "NETWORK") return "서버에 닿지 못했어요";
    if (error.status === 401) return "로그인이 풀렸어요. 다시 들어오면 쓰던 문구가 남아 있어요";
  }
  return "처리하지 못했어요. 잠시 뒤 다시 시도해 주세요";
}

type SendMode = "now" | "later";

export function ComposePage() {
  const api = useApi();
  const toast = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const toId = params.get("to");

  const [form, setForm] = useState<ComposeForm>(() => loadDraft() ?? EMPTY_FORM);
  const [recipient, setRecipient] = useState<AdminUserDTO | null>(null);
  const [preview, setPreview] = useState<AudiencePreview | null>(null);
  const [lang, setLang] = useState<"ko" | "en">("ko");
  const [touched, setTouched] = useState(false);
  const [campaignId, setCampaignId] = useState<UUID | null>(null);
  const [busy, setBusy] = useState<"test" | "send" | null>(null);
  const [confirm, setConfirm] = useState<SendMode | null>(null);
  const [mode, setMode] = useState<SendMode>("now");
  const [scheduleLocal, setScheduleLocal] = useState(() => seoulLocalFromNow(60));
  const savedSnapshot = useRef<string | null>(null);

  // 검색에서 고른 사람이 있으면 그 사람 한 명이 대상이다.
  useEffect(() => {
    if (!toId) {
      setRecipient(null);
      return;
    }
    let alive = true;
    api.getUser(toId).then(
      (user) => {
        if (!alive) return;
        setRecipient(user);
        if (!user) toast("그 사람을 찾지 못했어요", "error");
      },
      () => alive && toast("그 사람을 불러오지 못했어요", "error"),
    );
    return () => {
      alive = false;
    };
  }, [api, toId, toast]);

  const segment = useMemo(() => (toId ? { userIds: [toId] } : form.segment), [toId, form.segment]);
  const segmentKey = JSON.stringify(segment);

  useEffect(() => {
    const controller = new AbortController();
    setPreview(null);
    const timer = setTimeout(() => {
      api.previewAudience(JSON.parse(segmentKey), controller.signal).then(
        (result) => !controller.signal.aborted && setPreview(result),
        () => {},
      );
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [api, segmentKey]);

  useEffect(() => saveDraft(form), [form]);

  const errors = validate(form);
  const valid = Object.keys(errors).length === 0;
  const update = (patch: Partial<ComposeForm>) => setForm((f) => ({ ...f, ...patch }));

  /** 서버에 초안을 만들거나(처음) 바뀐 것만 고친다. 같은 내용이면 다시 부르지 않는다. */
  const ensureSaved = useCallback(async (): Promise<UUID> => {
    const input = toInput({ ...form, segment });
    const snapshot = JSON.stringify(input);
    if (campaignId && savedSnapshot.current === snapshot) return campaignId;
    const saved = campaignId ? await api.updateCampaign(campaignId, input) : await api.createCampaign(input);
    setCampaignId(saved.id);
    savedSnapshot.current = snapshot;
    return saved.id;
  }, [api, campaignId, form, segment]);

  const sendTest = async () => {
    setTouched(true);
    if (!valid || busy) return;
    setBusy("test");
    try {
      const id = await ensureSaved();
      const { sent } = await api.sendTest(id);
      toast(
        sent > 0 ? `시험 수신자 ${sent}명에게 보냈어요` : "시험 수신자가 없어요. 먼저 등록해 주세요",
        sent > 0 ? "info" : "error",
      );
    } catch (error) {
      toast(errorMessage(error), "error");
    } finally {
      setBusy(null);
    }
  };

  const scheduleIso = mode === "later" ? seoulLocalToIso(scheduleLocal) : undefined;
  const scheduleInPast = scheduleIso !== undefined && Date.parse(scheduleIso) <= Date.now();

  const askSend = () => {
    setTouched(true);
    if (!valid || busy || scheduleInPast) return;
    setConfirm(mode);
  };

  const send = async () => {
    if (busy) return;
    setBusy("send");
    try {
      const id = await ensureSaved();
      await api.schedule(id, scheduleIso);
      saveDraft(null);
      toast(mode === "now" ? "보내기 시작했어요" : "예약했어요");
      navigate(`/campaigns/${id}`);
    } catch (error) {
      toast(errorMessage(error), "error");
      setConfirm(null);
    } finally {
      setBusy(null);
    }
  };

  const shownError = (key: keyof ComposeForm) => (touched ? errors[key] : undefined);
  const titleKey = lang === "ko" ? "titleKo" : "titleEn";
  const bodyKey = lang === "ko" ? "bodyKo" : "bodyEn";
  const people = preview ? formatCount(preview.users) : "…";
  const devices = preview ? formatCount(preview.devices.ios + preview.devices.android) : "…";

  return (
    <div className="compose">
      <header className="page-head">
        <h1>안내 보내기</h1>
        <p>점검 · 업데이트 · 약관 · 새 기능을 알려요. 유료 플랜을 권하는 말은 쓰지 않아요.</p>
      </header>

      <div className="compose-grid">
        <div className="compose-main">
          <section className="glass glass-card panel">
            <h2>받는 사람</h2>
            {toId ? (
              <div className="recipient">
                <span className="avatar" aria-hidden="true">
                  {recipient?.name.charAt(0) ?? "·"}
                </span>
                <span className="recipient-main">
                  <strong>{recipient?.name ?? "불러오는 중"}</strong>
                  <small>{recipient?.emailMasked ?? ""}</small>
                </span>
                <PillButton
                  variant="quiet"
                  onClick={() => {
                    params.delete("to");
                    setParams(params);
                  }}
                >
                  조건으로 바꾸기
                </PillButton>
              </div>
            ) : (
              <>
                <div className="recipient-search">
                  <SearchDropdown
                    search={(q, signal) => api.searchUsers(q, signal)}
                    onSelect={(user) => setParams({ to: user.id })}
                    placeholder="한 사람에게만 보내려면 찾기"
                  />
                </div>
                <SegmentEditor value={form.segment} onChange={(next) => update({ segment: next })} />
              </>
            )}
            <p className="audience num" aria-live="polite">
              <strong>{people}명</strong> · 기기 {devices}대
              {preview && preview.users > 0 && (
                <span>
                  {" "}
                  (iOS {formatCount(preview.devices.ios)} · Android {formatCount(preview.devices.android)})
                </span>
              )}
            </p>
          </section>

          <section className="glass glass-card panel">
            <div className="panel-head">
              <h2>문구</h2>
              <div className="segmented" role="tablist" aria-label="언어">
                {(["ko", "en"] as const).map((l) => (
                  <button
                    key={l}
                    role="tab"
                    aria-selected={lang === l}
                    className={lang === l ? "is-on" : ""}
                    onClick={() => setLang(l)}
                  >
                    {l === "ko" ? "한국어" : "영어"}
                    {touched &&
                      (errors[l === "ko" ? "titleKo" : "titleEn"] || errors[l === "ko" ? "bodyKo" : "bodyEn"]) && (
                        <span className="dot" aria-label="고칠 곳 있음" />
                      )}
                  </button>
                ))}
              </div>
            </div>
            <TextField
              label="제목"
              value={form[titleKey]}
              max={TITLE_MAX}
              error={shownError(titleKey)}
              onChange={(v) => update({ [titleKey]: v })}
            />
            <TextField
              label="본문"
              value={form[bodyKey]}
              max={BODY_MAX}
              multiline
              error={shownError(bodyKey)}
              onChange={(v) => update({ [bodyKey]: v })}
            />
            <p className="hint">앱 언어가 영어인 사람은 영어 문구를, 나머지는 한국어 문구를 받아요.</p>
          </section>

          <section className="glass glass-card panel">
            <h2>누르면 열리는 곳</h2>
            <div className="segment-options">
              {DESTINATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  className="chip"
                  aria-pressed={form.destination === d.value}
                  onClick={() => update({ destination: d.value })}
                >
                  {d.label}
                </button>
              ))}
            </div>
            {form.destination === "url" && (
              <TextField
                label="주소"
                value={form.url}
                placeholder="https://www.syncrunlabs.com/…"
                error={touched ? errors.url : undefined}
                onChange={(v) => update({ url: v })}
              />
            )}
            <p className="hint">러닝 중인 사람은 화면이 바뀌지 않아요. 옛 앱은 앱만 열려요.</p>
          </section>
        </div>

        <aside className="compose-side">
          <div className="sticky">
            <NotificationPreview title={form[titleKey]} body={form[bodyKey]} />

            <section className="glass glass-card panel send-panel">
              <div className="segmented" role="radiogroup" aria-label="보낼 때">
                {(["now", "later"] as const).map((m) => (
                  <button
                    key={m}
                    role="radio"
                    aria-checked={mode === m}
                    className={mode === m ? "is-on" : ""}
                    onClick={() => setMode(m)}
                  >
                    {m === "now" ? "지금" : "예약"}
                  </button>
                ))}
              </div>
              {mode === "later" && (
                <label className="field">
                  <span>보낼 때 (한국 시간)</span>
                  <input
                    type="datetime-local"
                    value={scheduleLocal}
                    min={seoulLocalFromNow(1)}
                    onChange={(e) => setScheduleLocal(e.target.value)}
                  />
                  {scheduleInPast && <em className="error">지난 시각이에요</em>}
                </label>
              )}
              <PillButton variant="glass" onClick={sendTest} loading={busy === "test"} disabled={busy === "send"}>
                나에게 시험 발송
              </PillButton>
              <PillButton onClick={askSend} disabled={busy !== null || scheduleInPast || preview?.users === 0}>
                {mode === "now" ? `${people}명에게 보내기` : "예약하기"}
              </PillButton>
              {touched && !valid && <p className="error">고칠 곳이 있어요</p>}
            </section>
          </div>
        </aside>
      </div>

      {confirm && (
        <ConfirmSheet
          title={confirm === "now" ? "지금 보낼까요?" : "예약할까요?"}
          confirmLabel={confirm === "now" ? "보내기" : "예약하기"}
          busy={busy === "send"}
          onConfirm={send}
          onCancel={() => setConfirm(null)}
        >
          <p>
            <strong>{recipient && toId ? recipient.name : `${people}명`}</strong>에게 「{form.titleKo}」 안내를{" "}
            {confirm === "now" ? "지금 보내요" : `${scheduleLocal.replace("T", " ")}에 보내요`}. 나간 알림은 되돌릴 수
            없어요.
          </p>
        </ConfirmSheet>
      )}
    </div>
  );
}

function TextField({
  label,
  value,
  max,
  multiline,
  placeholder,
  error,
  onChange,
}: {
  label: string;
  value: string;
  max?: number;
  multiline?: boolean;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const n = countChars(value);
  const over = max !== undefined && n > max;
  return (
    <label className={`field${error ? " has-error" : ""}`}>
      <span className="field-head">
        {label}
        {max !== undefined && (
          <span className={`counter num${over ? " is-over" : ""}`}>
            {n}/{max}
          </span>
        )}
      </span>
      {multiline ? (
        <textarea rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && <em className="error">{error}</em>}
    </label>
  );
}
