import { useEffect, useRef } from "react";
import TopBar from "./TopBar";
import Hero from "./Hero";
import Gather from "./Gather";
import Countdown from "./Countdown";
import Run from "./Run";
import Card from "./Card";
import Closing from "./Closing";
import Dock, { type DockHandle } from "./Dock";
import { CREW_KM } from "../scenes/crew";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * 랜딩 — 워밍업(저절로 흐르는 필름) → 모으기(스크롤로 손이 모인다) → 3·2·1(시간으로 흐른다) →
 * 달리기(이 구간만 옆으로) → 카드(손에 들고 기울인다) → 오늘 저녁.
 *
 * 한 루프가 페이지 전체의 "러닝 상태"를 계산한다:
 *  - 스크롤 속도 → `--speed`(0~1, 문서 루트) · 도크의 페이스. 빨리 내리면 빨리 달린다.
 *  - 스크롤 위치 → 도크의 거리·시간·현재 장.
 * 스크롤을 가로채지 않는다. 축소 모션에서는 속도를 흘리지 않는다.
 */

/** 도크의 장 — 섹션 id. 함께·터널은 가로 구간 안의 패널이다 */
const CHAPTERS = ["top", "gather", "start", "together", "tunnel", "card"] as const;
const RUN_SECONDS = 31 * 60 + 26; // 5.24km 를 6'00"/km 로
const FAST = 3200; // 이 속도(px/s)면 전력 질주
const PACE_SLOW = 7.5 * 60; // --speed 가 막 움직이기 시작할 때의 페이스(초/km)
const PACE_FAST = 3 * 60 + 20;

export default function Landing() {
  const dockRef = useRef<DockHandle>(null);

  useEffect(() => {
    const root = document.documentElement;
    const still = shouldSkipReveal();
    let raf = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let speed = 0;

    const sectionOf = (id: string) => document.getElementById(id);
    const tick = (now: number) => {
      const y = window.scrollY;
      const dt = Math.max(0.001, (now - lastT) / 1000);
      const v = Math.abs(y - lastY) / dt;
      lastY = y;
      lastT = now;
      // 올라갈 때는 빠르게, 내려올 때는 천천히 — 발을 멈춰도 숨은 바로 안 가라앉는다
      const goal = still ? 0 : Math.min(1, v / FAST);
      speed += (goal - speed) * (goal > speed ? 0.35 : 0.06);
      if (speed < 0.002) speed = 0;
      root.style.setProperty("--speed", speed.toFixed(3));

      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, y / max);
      const mid = window.innerHeight / 2;
      let chapter = 0;
      CHAPTERS.forEach((id, i) => {
        const r = sectionOf(id)?.getBoundingClientRect();
        if (!r || r.top > mid) return;
        // 가로 구간의 패널은 화면 가운데를 가로로도 지나야 그 장이다
        if ((id === "together" || id === "tunnel") && r.left > window.innerWidth / 2) return;
        chapter = i;
      });
      dockRef.current?.update({
        progress,
        chapter,
        km: CREW_KM[0] * progress,
        seconds: RUN_SECONDS * progress,
        pace: speed < 0.02 ? null : PACE_SLOW - (PACE_SLOW - PACE_FAST) * speed,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      root.style.removeProperty("--speed");
    };
  }, []);

  /** 장 눈금 → 그 섹션(가로 구간이면 그 패널)이 화면 왼쪽 위에 오는 스크롤 위치 */
  const jump = (i: number) => {
    const id = CHAPTERS[i];
    const el = document.getElementById(id);
    if (!el) return;
    let y = el.getBoundingClientRect().top + window.scrollY;
    if (id === "together" || id === "tunnel") {
      const run = el.closest<HTMLElement>(".run");
      if (run && !run.classList.contains("is-still"))
        y = run.getBoundingClientRect().top + window.scrollY + el.offsetLeft;
    }
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      <TopBar />
      <Hero />
      <Gather />
      <Countdown />
      <Run />
      <Card />
      <Closing />
      <Dock ref={dockRef} onJump={jump} />
    </>
  );
}
