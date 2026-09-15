import { useEffect, useRef } from "react";
import { shouldSkipReveal } from "../../lib/reveal";

/* public/hero/ 의 정적 파일. 해시가 없어 교체할 때는 버전 접미를 올린다. */
const LOOP = "/hero/dusk-loop.v1";
const POSTER = "/hero/dusk-poster.v1.webp";

/**
 * HeroBackdrop — 히어로 뒤에 깔리는 블러 영상. 분위기만 담당하고 내용은 앞의 HTML이 든다.
 *
 * 재생은 클라이언트가 정한다 — 서버 HTML에는 autoplay가 없다. reduced-motion·`?reveal=all`·
 * 데이터 절약 모드에서는 포스터만 보이고, 그 밖에는 페이지 로드가 끝난 뒤 유휴 시간에 재생을 시작해
 * 첫 페인트·LCP와 경쟁하지 않는다. 자동재생이 막히면 포스터가 그대로 남는다.
 */
export default function HeroBackdrop() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || shouldSkipReveal()) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;

    let cancelled = false;
    const play = () => {
      if (!cancelled) video.play().catch(() => {});
    };
    const whenIdle = () => {
      if (typeof requestIdleCallback === "function") requestIdleCallback(play, { timeout: 1500 });
      else setTimeout(play, 800);
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", whenIdle);
    };
  }, []);

  return (
    <div className="hero__backdrop" aria-hidden="true">
      <video ref={ref} muted playsInline loop preload="none" poster={POSTER}>
        <source src={`${LOOP}.webm`} type="video/webm" />
        <source src={`${LOOP}.mp4`} type="video/mp4" />
      </video>
      <div className="hero__scrim" />
    </div>
  );
}
