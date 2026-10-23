"use client";

import "../styles/support.css";
import "../styles/crew-join.css";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import wordmark from "@/public/brand/wordmark.png";
import { crewJoinCopy } from "../i18n/crewJoin";
import { useLang } from "../i18n/lang";
import { APP_STORE_URL } from "../lib/app-store";

/** 초대 링크 미리보기 (api-contract §18.12) — 로그인 없이 부르는 공개 경로 */
const API_BASE = "https://api.syncrunlabs.com/api/v1";
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

interface Preview {
  crewName: string;
  inviterName: string;
  memberCount: number;
}

type State = { kind: "loading" } | { kind: "ready"; preview: Preview } | { kind: "unknown" } | { kind: "expired" };

/** `/crew/join/<token>` · `/en/crew/join/<token>`의 마지막 조각. 정적 페이지라 주소에서 읽는다. */
function tokenFromPath(pathname: string): string | null {
  const last = pathname.replace(/\/+$/, "").split("/").pop() ?? "";
  return last !== "join" && TOKEN_PATTERN.test(last) ? last : null;
}

const noSubscription = () => () => {};

/**
 * 크루 초대 링크를 연 사람의 페이지. 크루 이름 · 초대한 사람 · 크루원 수를 보이고,
 * [SyncRun에서 열기]로 앱 주소(`syncrun://crew/join/<token>`)에 넘긴다 — 메신저 안의 브라우저는
 * 같은 도메인의 링크로는 앱을 열지 않기 때문이다. 앱이 없으면 설치 뒤 링크를 다시 누르게 안내한다.
 */
export default function CrewJoin() {
  const { lang, base } = useLang();
  const c = crewJoinCopy[lang];
  // 정적 페이지라 서버에서 그릴 때는 주소를 모른다 — 브라우저에서만 읽는다
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
  const [fetched, setFetched] = useState<State>({ kind: "loading" });
  const state: State = hydrated && !token ? { kind: "expired" } : fetched;

  useEffect(() => {
    if (!token) return;
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
  }, [token]);

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

      <main className="doc crew-join">
        <div className="container crew-join__inner">
          {state.kind === "expired" ? (
            <section className="doc__head">
              <h1 className="doc__title">{c.expired.title}</h1>
              <p className="lede doc__lede">{c.expired.lede}</p>
            </section>
          ) : (
            <>
              <section className="doc__head">
                <h1 className="doc__title">{state.kind === "ready" ? state.preview.crewName : c.fallbackTitle}</h1>
                {state.kind === "ready" && (
                  <p className="doc__meta">{c.invitedBy(state.preview.inviterName, state.preview.memberCount)}</p>
                )}
                <p className="lede doc__lede">{c.lede}</p>
              </section>

              {token && (
                <a href={`syncrun://crew/join/${token}`} className="btn btn-primary crew-join__open">
                  {c.open}
                </a>
              )}

              <section className="doc__section">
                <h2 className="h2 doc__h2">{c.install.heading}</h2>
                <ol className="doc__list crew-join__steps">
                  {c.install.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <a href={APP_STORE_URL} className="btn crew-join__store">
                  {c.install.store}
                </a>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
