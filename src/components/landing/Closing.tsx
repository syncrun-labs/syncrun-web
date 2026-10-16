import { useEffect, useRef } from "react";
import Image from "next/image";
import curveEnd from "@/public/scenes/curve-end.jpg";
import AppleGlyph from "../scenes/AppleGlyph";
import { useLang } from "../../i18n/lang";
import { APP_STORE_URL } from "../../lib/app-store";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * 오늘 저녁 — 화면에 들어오면 휘어진 강변 길을 따라 카메라가 한 번 달려가고, 멈춘 마지막 장면의 길 위에
 * 코랄 선이 그어진다. 선은 영상의 마지막 장에 맞춰 두었다. 정지 상태(축소 모션)에서는 영상 대신 마지막 장 사진을 깔아 선이 그대로 맞는다.
 */
export default function Closing() {
  const { t, base } = useLang();
  const c = t.cta;
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    const video = videoRef.current;
    if (!el || !video) return;
    if (shouldSkipReveal()) {
      el.classList.add("is-still", "is-done");
      return;
    }
    const done = () => el.classList.add("is-done");
    video.addEventListener("ended", done);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !el.classList.contains("is-playing")) {
          el.classList.add("is-playing");
          video.play().catch(done);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      video.removeEventListener("ended", done);
    };
  }, []);

  return (
    <section className="closing" id="cta" ref={ref}>
      <div className="closing__film">
        <Image src={curveEnd} alt="" fill sizes="100vw" className="closing__poster" />
        <video
          ref={videoRef}
          className="closing__video"
          src="/media/curve.mp4"
          poster="/scenes/curve-start.jpg"
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <svg className="closing__line" viewBox="0 0 1000 562.5" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d="M722 575 C690 500 650 430 606 360 S548 280 516 250" pathLength={1} />
        </svg>
        <div className="closing__shade" aria-hidden="true" />
      </div>
      <div className="closing__copy container">
        <h2 className="h2">
          <span className="line">{c.title[0]}</span>
          <span className="line line--accent">{c.title[1]}</span>
        </h2>
        <p className="lede closing__lede">{c.lede}</p>
        <div className="hero__actions">
          <a href={APP_STORE_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
            <AppleGlyph />
            {c.ctaPrimary}
          </a>
          <a href={`${base}/support`} className="btn btn-ghost">
            {c.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
