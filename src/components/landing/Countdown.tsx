import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import start from "@/public/scenes/start.jpg";
import { CREW_ON_DARK } from "../scenes/crew";
import { useLang } from "../../i18n/lang";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * 3 · 2 · 1 — 이 섹션만 스크롤이 아니라 시간으로 흐른다.
 *
 * 화면을 거의 다 채우면 앱과 똑같이 숫자 하나가 1초씩 지나가고(숫자마다 한 번 때리듯 튄다),
 * 1이 끝나는 순간 영상 속 사람들이 출발선을 박차고 나가며 네 선이 화면을 가로질러 쏘아진다.
 * 그 선들이 다음 "함께" 구간의 왼쪽 끝으로 이어진다. 한 번 보고 나면 [다시 3·2·1]로 다시 볼 수 있다.
 *
 * 축소 모션에서는 카운트다운을 돌리지 않고 출발한 뒤의 모습(선·제목)으로 멈춰 있다.
 */

const PUSH_OFF = 3.55; // 영상에서 발을 떼는 시각(초)
type Step = "idle" | "3" | "2" | "1" | "go";

export default function Countdown() {
  const { t } = useLang();
  const s = t.start;
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>("idle");
  const timers = useRef<number[]>([]);

  const run = () => {
    timers.current.forEach(clearTimeout);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setStep("3");
    timers.current = [
      window.setTimeout(() => setStep("2"), 1000),
      window.setTimeout(() => setStep("1"), 2000),
      window.setTimeout(() => {
        setStep("go");
        if (video) {
          video.currentTime = PUSH_OFF;
          video.play().catch(() => {});
        }
      }, 3000),
    ];
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shouldSkipReveal()) {
      el.classList.add("is-still");
      return;
    }
    let played = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !played) {
          played = true;
          run();
        }
      },
      { threshold: 0.72 },
    );
    io.observe(el);
    const pending = timers.current;
    return () => {
      io.disconnect();
      pending.forEach(clearTimeout);
    };
    // run 은 매번 새로 만들어지지만 관찰은 한 번만 건다
  }, []);

  return (
    <section className="count" id="start" ref={ref} data-step={step} data-chapter="2">
      <div className="count__film">
        <Image src={start} alt={s.photoAlt} fill sizes="100vw" className="count__poster" />
        <video
          ref={videoRef}
          className="count__video"
          src="/media/start.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="count__shade" aria-hidden="true" />
      </div>

      <div className="count__numbers num" aria-live="polite">
        {(["3", "2", "1"] as const).map((n) => (
          <span key={n} className={step === n ? "count__n is-on" : "count__n"} aria-hidden={step !== n}>
            {n}
          </span>
        ))}
      </div>

      <div className="count__copy container">
        <h2 className="h2">{s.title}</h2>
        <p className="lede count__lede">{s.lede}</p>
        <button type="button" className="count__replay" onClick={run}>
          {s.replay}
        </button>
      </div>

      <svg className="count__lanes" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
        {CREW_ON_DARK.map((c, i) => (
          <line
            key={c}
            x1="0"
            x2="1000"
            y1={9 + i * 14}
            y2={9 + i * 14}
            stroke={c}
            style={{ transitionDelay: `${i * 45}ms` }}
          />
        ))}
      </svg>
    </section>
  );
}
