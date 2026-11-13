"use client";

import "../styles/support.css";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import wordmark from "@/public/brand/wordmark.png";
import { crewJoinCopy } from "../i18n/crewJoin";
import { useLang } from "../i18n/lang";
import { APP_STORE_URL } from "../lib/app-store";
import styles from "./CrewJoin.module.css";

/** 초대 링크 미리보기 (api-contract §18.12): 로그인 없이 부르는 공개 경로 */
const API_BASE = "https://api.syncrunlabs.com/api/v1";
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

/** 러너 팔레트: 크루 소개 항목 앞의 짧은 바에 차례로 쓴다 */
const RUNNERS = ["var(--runner-0)", "var(--runner-1)", "var(--runner-3)"];

/** 앱의 그룹 목록처럼: 작은 회색 머리말 아래 흰 카드 하나 */
function Group({ label, children, footer }: { label?: string; children: React.ReactNode; footer?: string }) {
  return (
    <section className={styles.group}>
      {label && <h2 className={styles.label}>{label}</h2>}
      <div className={styles.card}>{children}</div>
      {footer && <p className={styles.footer}>{footer}</p>}
    </section>
  );
}

interface Preview {
  crewName: string;
  inviterName: string;
  memberCount: number;
}

type State = { kind: "loading" } | { kind: "ready"; preview: Preview } | { kind: "unknown" } | { kind: "expired" };
type Device = "ios" | "android" | "desktop";

/** `/crew/join/<token>` · `/en/crew/join/<token>`의 마지막 조각. 정적 페이지라 주소에서 읽는다. */
function tokenFromPath(pathname: string): string | null {
  const last = pathname.replace(/\/+$/, "").split("/").pop() ?? "";
  return last !== "join" && TOKEN_PATTERN.test(last) ? last : null;
}

/** 초대를 연 기기. iPadOS는 데스크톱 Safari로 보이므로 터치 지점 수로 가른다. */
function readDevice(): Device {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

/** 개발 서버에서만: `?device=android` 같은 값으로 기기 안내를, `?sample`로 미리보기를 확인한다 */
function devParam(name: string): string | null {
  if (process.env.NODE_ENV !== "development") return null;
  return new URLSearchParams(window.location.search).get(name);
}

const SAMPLE: Preview = { crewName: "여의도 새벽런", inviterName: "서연", memberCount: 12 };
const noSubscription = () => () => {};

/**
 * 크루 초대 링크를 연 사람의 페이지. 앱의 「나」 탭 크루 초대 칸과 같은 모양으로(회색 바탕, 작은 머리말, 흰 카드,
 * 검정 알약 버튼) 초대 카드(크루 이름 · 초대한 사람 · 크루원 수)를 보이고,
 * 기기에 맞는 다음 행동을 하나 둔다. iPhone은 [SyncRun에서 열기]로 앱 주소(`syncrun://crew/join/<token>`)에 넘긴다.
 * 메신저 안의 브라우저는 같은 도메인의 링크로는 앱을 열지 않기 때문이다. 앱이 없으면 설치 뒤 링크를 다시 누르게 안내한다.
 * 아래에 크루로 뛰면 무엇이 좋은지 세 줄을 두어, 앱을 모르는 사람도 초대의 가치를 알게 한다.
 */
export default function CrewJoin() {
  const { lang, base } = useLang();
  const c = crewJoinCopy[lang];
  // 정적 페이지라 서버에서 그릴 때는 주소와 기기를 모른다. 브라우저에서만 읽는다.
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  const token = useSyncExternalStore(
    noSubscription,
    () => tokenFromPath(window.location.pathname),
    () => null,
  );
  const device = useSyncExternalStore<Device>(
    noSubscription,
    () => (devParam("device") as Device | null) ?? readDevice(),
    () => "ios",
  );
  const sample = useSyncExternalStore(
    noSubscription,
    () => devParam("sample") !== null,
    () => false,
  );
  const [fetched, setFetched] = useState<State>({ kind: "loading" });
  const state: State = sample ? { kind: "ready", preview: SAMPLE } : hydrated && !token ? { kind: "expired" } : fetched;

  useEffect(() => {
    if (!token || sample) return;
    const controller = new AbortController();
    fetch(`${API_BASE}/crews/links/${token}`, { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 404) return setFetched({ kind: "expired" });
        if (!res.ok) return setFetched({ kind: "unknown" });
        const body = (await res.json()) as { data: Preview };
        setFetched({ kind: "ready", preview: body.data });
      })
      .catch(() => {
        if (!controller.signal.aborted) setFetched({ kind: "unknown" });
      });
    return () => controller.abort();
  }, [token, sample]);

  const otherLang = lang === "ko" ? "/en" : "";
  const otherHref = token ? `${otherLang}/crew/join/${token}` : `${otherLang}/crew/join`;

  return (
    <>
      <header className="doc-nav">
        <div className="container doc-nav__inner">
          <a href={base || "/"} className="doc-nav__brand">
            <Image src={wordmark} alt="SyncRun" className="doc-nav__wordmark" priority />
          </a>
          <div className="doc-nav__actions">
            <a href={otherHref} className="doc-nav__link">
              {c.other}
            </a>
          </div>
        </div>
      </header>

      <main className={styles.page}>
        <div className={styles.inner}>
          {state.kind === "expired" ? (
            <Group>
              <h1 className={styles.crew}>{c.expired.title}</h1>
              <p className={styles.text}>{c.expired.lede}</p>
            </Group>
          ) : (
            <>
              <Group label={c.label} footer={c.lede}>
                <div aria-busy={state.kind === "loading"}>
                  {state.kind === "ready" ? (
                    <>
                      <h1 className={styles.crew}>{state.preview.crewName}</h1>
                      <p className={styles.sub}>
                        {c.invitedBy(state.preview.inviterName)} · {c.members(state.preview.memberCount)}
                      </p>
                    </>
                  ) : (
                    <h1 className={styles.crew}>{c.fallbackTitle}</h1>
                  )}
                </div>
                {/* Android 앱도 같은 앱 주소를 받는다. 메신저 안 브라우저에서 넘어갈 길이 이 버튼뿐이다. PC에서는 열 앱이 없다 */}
                {device !== "desktop" && token && (
                  <a href={`syncrun://crew/join/${token}`} className={`${styles.button} ${styles.primary}`}>
                    {c.open}
                  </a>
                )}
              </Group>

              {device === "ios" && (
                <Group label={c.install.heading}>
                  <ol className={styles.rows}>
                    {c.install.steps.map((step, i) => (
                      <li key={step}>
                        <span className={styles.n}>{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <a href={APP_STORE_URL} className={`${styles.button} ${styles.secondary}`}>
                    {c.install.store}
                  </a>
                </Group>
              )}

              {device === "android" && (
                <Group label={c.android.heading}>
                  <p className={styles.text}>{c.android.lede}</p>
                </Group>
              )}

              {device === "desktop" && (
                <Group label={c.desktop.heading}>
                  <p className={styles.text}>{c.desktop.lede}</p>
                  <a
                    href={APP_STORE_URL}
                    className={`${styles.button} ${styles.secondary}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.desktop.store}
                  </a>
                </Group>
              )}
            </>
          )}

          <Group label={c.about.heading}>
            <ul className={styles.rows}>
              {c.about.facts.map((f, i) => (
                <li key={f.k} className={styles.fact} style={{ "--bar": RUNNERS[i] } as React.CSSProperties}>
                  <h3>{f.k}</h3>
                  <p>{f.v}</p>
                </li>
              ))}
              <li>
                <a href={base || "/"} className={styles.more}>
                  {c.about.more}
                  <span aria-hidden="true">›</span>
                </a>
              </li>
            </ul>
          </Group>
        </div>
      </main>
    </>
  );
}
