import { useEffect, useRef } from "react";
import Image from "next/image";
import poster from "@/public/scenes/reel-poster.jpg";
import AppleGlyph from "../scenes/AppleGlyph";
import { useLang } from "../../i18n/lang";
import { APP_STORE_URL } from "../../lib/app-store";
import { useProgress } from "../../lib/useProgress";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * 워밍업 — 페이지가 열리면 영상처럼 저절로 흐른다.
 *
 * 네 컷(강변 → 출발선 → 터널 → 휘어진 길)을 달리기 케이던스(분당 180보)에 맞춰 1.33초(4보)씩 잘라 이은 5.3초 필름이
 * 자동 재생되고, 컷마다 제목 한 마디가 박자에 맞춰 들어온다. 위의 막대 넷은 스토리처럼 컷의 진행을 보여준다.
 * 스크롤을 시작하면 필름이 작아지며 위로 밀려나고 다음 장면으로 넘어간다 — 저절로 흐르다가 손에 넘어오는 구조다.
 *
 * 제목 전체는 h1 로 늘 문서에 있다. 박자 마디는 장식이라 읽기 도구에서 숨긴다.
 * 축소 모션에서는 재생하지 않고 포스터 위에 제목 전체를 둔다.
 */

const CUT = 4 / 3; // 한 컷 = 4보 @ 180spm

export default function Hero() {
  const { t } = useLang();
  const h = t.hero;
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const beatsRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  useProgress(ref, "pin");

  useEffect(() => {
    const video = videoRef.current;
    const beats = beatsRef.current;
    const bars = barsRef.current;
    const section = ref.current;
    if (!video || !beats || !bars || !section) return;
    if (shouldSkipReveal()) {
      section.classList.add("is-still");
      return;
    }
    video.play().catch(() => section.classList.add("is-still"));

    let raf = 0;
    let shown = -1;
    const fills = Array.from(bars.children) as HTMLElement[];
    const words = Array.from(beats.children) as HTMLElement[];
    const tick = () => {
      const tm = video.currentTime;
      const cut = Math.min(3, Math.floor(tm / CUT));
      fills.forEach((b, i) => b.style.setProperty("--fill", String(Math.min(1, Math.max(0, (tm - i * CUT) / CUT)))));
      if (cut !== shown) {
        shown = cut;
        words.forEach((w, i) => w.classList.toggle("is-on", i === cut));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // 화면 밖에서는 필름을 멈춘다
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(section);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <section className="hero" id="top" ref={ref} data-chapter="0">
      <div className="hero__stage">
        <div className="hero__film">
          <Image src={poster} alt="" fill priority sizes="100vw" className="hero__poster" />
          <video
            ref={videoRef}
            className="hero__video"
            src="/media/reel.mp4"
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <div className="hero__shade" aria-hidden="true" />
          <div className="hero__bars" ref={barsRef} aria-hidden="true">
            {h.beats.map((b) => (
              <span key={b} className="hero__bar" />
            ))}
          </div>
        </div>

        <div className="hero__copy container">
          <h1 className="hero__title">
            <span className="line">{h.title[0]}</span>
            <span className="line line--accent">{h.title[1]}</span>
          </h1>
          <div className="hero__beats" ref={beatsRef} aria-hidden="true">
            {h.beats.map((b, i) => (
              <span key={b} className={i % 2 ? "hero__beat hero__beat--accent" : "hero__beat"}>
                {b}
              </span>
            ))}
          </div>
          <p className="lede hero__lede">{h.lede}</p>
          <div className="hero__actions">
            <a href={APP_STORE_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
              <AppleGlyph />
              {h.ctaPrimary}
            </a>
          </div>
          <p className="hero__cue" aria-hidden="true">
            {t.dock.walk}
            <span className="hero__cue-arrow">↓</span>
          </p>
        </div>
      </div>
    </section>
  );
}
