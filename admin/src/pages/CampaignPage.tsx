import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { CampaignDTO } from "../api/types";
import { useApi } from "../auth/auth";
import { STATUS_LABEL } from "../components/CampaignRow";
import { ConfirmSheet } from "../components/ConfirmSheet";
import { NotificationPreview } from "../components/NotificationPreview";
import { PillButton } from "../components/PillButton";
import { useToast } from "../components/Toast";
import { DESTINATIONS, describeSegment } from "../lib/campaign";
import { formatCount, formatDateTime } from "../lib/format";

function pct(part: number, whole: number): string {
  return whole > 0 ? `${Math.round((part / whole) * 100)}%` : "—";
}

export function CampaignPage() {
  const { id = "" } = useParams();
  const api = useApi();
  const toast = useToast();
  const [campaign, setCampaign] = useState<CampaignDTO | null>(null);
  const [missing, setMissing] = useState(false);
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api.getCampaign(id).then(setCampaign, () => setMissing(true));
  }, [api, id]);

  useEffect(load, [load]);

  // 보내는 중이면 5초마다 다시 읽는다.
  useEffect(() => {
    if (campaign?.status !== "sending") return;
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [campaign?.status, load]);

  if (missing) {
    return (
      <div className="empty-page">
        <p>이 알림을 찾지 못했어요.</p>
        <Link to="/">홈으로</Link>
      </div>
    );
  }
  if (!campaign) return <div className="row-skeleton glass-inset skeleton" style={{ height: 240 }} />;

  const { counts } = campaign;
  const canCancel = campaign.status === "scheduled" || campaign.status === "sending";
  const destination = DESTINATIONS.find((d) => d.value === campaign.destination)?.label;

  const cancel = async () => {
    setBusy(true);
    try {
      setCampaign(await api.cancel(campaign.id));
      toast("취소했어요");
    } catch {
      toast("취소하지 못했어요. 이미 나갔을 수 있어요", "error");
      load();
    } finally {
      setBusy(false);
      setAsking(false);
    }
  };

  return (
    <div className="campaign">
      <header className="page-head">
        <span className={`status status-${campaign.status}`}>{STATUS_LABEL[campaign.status]}</span>
        <h1>{campaign.titleKo}</h1>
        <p>
          {campaign.scheduledAt &&
            `${formatDateTime(campaign.scheduledAt)} ${campaign.status === "scheduled" ? "예정" : "시작"}`}
          {" · "}
          {campaign.createdBy}
        </p>
      </header>

      <div className="stats">
        <Stat label="대상 기기" value={formatCount(counts.target)} />
        <Stat label="보냄" value={formatCount(counts.sent)} sub={pct(counts.sent, counts.target)} />
        <Stat label="실패" value={formatCount(counts.failed)} sub={pct(counts.failed, counts.target)} />
        <Stat label="열람한 사람" value={formatCount(counts.opened)} sub={pct(counts.opened, counts.sent)} accent />
      </div>
      <p className="hint">열람은 앱이 알려 온 만큼만 세서 실제보다 적을 수 있어요.</p>

      <div className="campaign-grid">
        <section className="glass glass-card panel">
          <h2>내용</h2>
          <dl className="facts">
            <dt>한국어</dt>
            <dd>
              <strong>{campaign.titleKo}</strong>
              <br />
              {campaign.bodyKo}
            </dd>
            <dt>영어</dt>
            <dd>
              <strong>{campaign.titleEn}</strong>
              <br />
              {campaign.bodyEn}
            </dd>
            <dt>열리는 곳</dt>
            <dd>{campaign.destination === "url" ? campaign.url : destination}</dd>
            <dt>대상</dt>
            <dd>{describeSegment(campaign.segment)}</dd>
          </dl>
          {canCancel && (
            <PillButton variant="danger" onClick={() => setAsking(true)}>
              {campaign.status === "scheduled" ? "예약 취소" : "남은 발송 멈추기"}
            </PillButton>
          )}
        </section>
        <NotificationPreview title={campaign.titleKo} body={campaign.bodyKo} />
      </div>

      {asking && (
        <ConfirmSheet
          title="취소할까요?"
          confirmLabel="취소하기"
          busy={busy}
          onConfirm={cancel}
          onCancel={() => setAsking(false)}
        >
          <p>아직 나가지 않은 알림만 멈춰요. 이미 받은 사람의 알림은 되돌릴 수 없어요.</p>
        </ConfirmSheet>
      )}
    </div>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`stat glass glass-card${accent ? " is-accent" : ""}`}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value num">{value}</strong>
      {sub && <span className="stat-sub num">{sub}</span>}
    </div>
  );
}
