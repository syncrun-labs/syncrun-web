import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import wrist from "@/public/scenes/wrist.jpg";
import tunnel from "@/public/scenes/tunnel.jpg";
import tunnelSeq from "@/public/scenes/tunnel/manifest.json";
import ScrubFrames from "./ScrubFrames";
import { scrubbers } from "./scrub";
import { buildRun, yAt, type Anchor, type RunGeometry, type RunPanel } from "./runGeometry";
import SafeBoundary from "../reactbits/SafeBoundary";
import { CREW_KM, CREW_ON_DARK, CREW_ON_LIGHT, CREW_TOTAL } from "../scenes/crew";
import { useLang } from "../../i18n/lang";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * 달리기 — 페이지에서 이 구간만 옆으로 달린다.
 *
 * 3·2·1에서 쏘아진 네 선이 화면 왼쪽 끝으로 들어와 "함께"에서 벌어지고, 터널에서 점선(걸음으로 잰 구간)이 되고,
 * "도착"에서 각자 달린 몫에 멈춘다. 선은 화면 한가운데(지금 달리는 자리)까지만 보이고 끝에 머리 점이 붙는다.
 * 스크롤을 가로채지 않는다 — 무대가 sticky 이고 섹션 높이가 띠 길이만큼이라 세로 1px 이 가로 1px 이다.
 *
 * 빨리 스크롤하면 빨리 달린다: 전역 `--speed`(0~1, Landing 이 스크롤 속도에서 계산)가 속도선과 제목의 기울기를 정한다.
 * 패널마다 `--lp`(0~1, 한가운데 0.5)가 흐른다. 축소 모션에서는 세로로 풀린다.
 */

export default function Run() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const headsRef = useRef<SVGSVGElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const kmRef = useRef<HTMLSpanElement>(null);
  const [geo, setGeo] = useState<{ g: RunGeometry; w: number; h: number } | null>(null);

  useEffect(() => {
    const section = ref.current;
    const strip = stripRef.current;
    if (!section || !strip) return;
    const panels = Array.from(strip.querySelectorAll<HTMLElement>("[data-run]"));
    const tunnelEl = strip.querySelector<HTMLElement>('[data-run="tunnel"]');
    const finishEl = strip.querySelector<HTMLElement>('[data-run="finish"]');

    if (shouldSkipReveal()) {
      section.classList.add("is-still");
      panels.forEach((p) => p.style.setProperty("--lp", "1"));
      if (finishEl) finishEl.dataset.done = "4";
      if (totalRef.current) totalRef.current.textContent = CREW_TOTAL.toFixed(2);
      if (kmRef.current) kmRef.current.textContent = (CREW_KM[0] * 0.7).toFixed(2);
      if (tunnelEl) tunnelEl.dataset.mode = "steps";
      return;
    }

    let vw = 0;
    let vh = 0;
    let stripW = 0;
    let boxes = new Map<RunPanel, { x: number; w: number }>();
    let g: RunGeometry | null = null;

    const measure = () => {
      vw = document.documentElement.clientWidth;
      vh = window.innerHeight;
      stripW = strip.scrollWidth;
      section.style.height = `${stripW - vw + vh}px`;
      boxes = new Map(panels.map((p) => [p.dataset.run as RunPanel, { x: p.offsetLeft, w: p.offsetWidth }]));
      const resolve = ([k, fx, fy]: Anchor): [number, number] => {
        const b = boxes.get(k)!;
        return [b.x + fx * b.w, fy * vh];
      };
      g = buildRun(resolve);
      setGeo({ g, w: stripW, h: vh });
    };

    let sx = -1;
    let raf = 0;
    let last = 0;
    const target = () => Math.min(stripW - vw, Math.max(0, -section.getBoundingClientRect().top));

    const draw = () => {
      if (!g) return;
      const clipX = sx + vw / 2;
      strip.style.transform = `translate3d(${-sx}px,0,0)`;
      if (inkRef.current) inkRef.current.style.width = `${clipX}px`;

      for (const p of panels) {
        const b = boxes.get(p.dataset.run as RunPanel)!;
        const lp = Math.min(1, Math.max(0, (vw - (b.x - sx)) / (vw + b.w)));
        p.style.setProperty("--lp", lp.toFixed(4));
        scrubbers.get(p)?.(lp);
      }

      if (tunnelEl) tunnelEl.dataset.mode = clipX >= g.walk[0] && clipX <= g.walk[1] ? "steps" : "gps";

      // 머리 점 · 도착한 사람 수 · 합산 거리
      let done = 0;
      let sum = 0;
      const heads = headsRef.current?.children;
      g.runners.forEach((r, i) => {
        const x = Math.min(clipX, r.endX);
        const y = yAt(r.track, x);
        const c = heads?.[i] as SVGCircleElement | undefined;
        if (c) {
          if (y === null) c.setAttribute("r", "0");
          else {
            c.setAttribute("cx", x.toFixed(1));
            c.setAttribute("cy", y.toFixed(1));
            c.setAttribute("r", i === 0 ? "7" : "6");
          }
        }
        if (clipX >= r.endX) done++;
        const f = Math.min(1, Math.max(0, (x - r.track[0][0]) / Math.max(1, r.endX - r.track[0][0])));
        sum += CREW_KM[i] * f;
      });
      if (finishEl && finishEl.dataset.done !== String(done)) finishEl.dataset.done = String(done);
      if (totalRef.current) totalRef.current.textContent = sum.toFixed(2);
      const me = Math.min(1, Math.max(0, (clipX - g.startX) / (g.finishX - g.startX)));
      if (kmRef.current) kmRef.current.textContent = (CREW_KM[0] * me).toFixed(2);
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      const goal = target();
      if (sx < 0 || Math.abs(goal - sx) > vw * 1.5) sx = goal;
      else sx += (goal - sx) * (1 - Math.exp(-dt / 0.085));
      if (Math.abs(goal - sx) < 0.3) sx = goal;
      draw();
      raf = requestAnimationFrame(tick);
    };

    // 첫 측정은 다음 프레임에 — 효과 본문에서 상태를 바로 바꾸지 않는다
    raf = requestAnimationFrame(() => {
      measure();
      raf = requestAnimationFrame(tick);
    });
    const ro = new ResizeObserver(() => {
      measure();
      sx = target();
      draw();
    });
    ro.observe(document.documentElement);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const tg = t.together;
  const tn = t.tunnel;
  const fn = t.finish;
  // 먼저 들어온 순서 — 짧게 달린 사람부터
  const order = [3, 2, 1, 0];

  return (
    <section className="run" ref={ref} data-chapter="3">
      <div className="run__view">
        <div className="run__strip" ref={stripRef}>
          {/* ── 함께 ── */}
          <section className="rp rp--together" data-run="together" id="together">
            <div className="rp__copy">
              <h2 className="h2 run__title">
                <span className="line">{tg.title[0]}</span>
                <span className="line">{tg.title[1]}</span>
              </h2>
              <p className="lede together__lede">{tg.lede}</p>
            </div>
            <figure className="together__shot">
              <Image src={wrist} alt={tg.photoAlt} fill sizes="46vw" className="rp__img" />
              <div className="watch" aria-hidden="true">
                <div className="watch__face">
                  <div className="watch__cheer" style={{ "--c": CREW_ON_LIGHT[2] } as CSSProperties}>
                    <span className="watch__dot" />
                    <span className="watch__who">{t.crew[2]}</span>
                    <span className="watch__what">{tg.cheer}</span>
                    <span className="watch__sub">{tg.cheerSub}</span>
                  </div>
                  <div className="watch__km num">
                    {CREW_KM[3].toFixed(2)}
                    <small>km</small>
                  </div>
                  <div className="watch__pace num">6&apos;02&quot;</div>
                </div>
              </div>
              <div className="grain" aria-hidden="true" />
            </figure>
          </section>

          {/* ── 터널 ── */}
          <section className="rp rp--tunnel" data-run="tunnel" data-scrub-host data-mode="gps" id="tunnel">
            <ScrubFrames
              name="tunnel"
              frames={tunnelSeq.frames}
              from={0.15}
              to={0.85}
              poster={tunnel}
              alt={tn.photoAlt}
            />
            <div className="rp__shade" aria-hidden="true" />
            <div className="rp__copy tunnel__copy">
              <h2 className="h2 run__title">
                <span className="line">{tn.title[0]}</span>
                <span className="line line--accent">{tn.title[1]}</span>
              </h2>
              <p className="lede tunnel__lede">{tn.lede}</p>
              <p className="tunnel__hud">
                <span className="tunnel__km num">
                  <span ref={kmRef}>0.00</span>
                  <small>km</small>
                </span>
                <span className="tunnel__mode tunnel__mode--gps">{tn.gps}</span>
                <span className="tunnel__mode tunnel__mode--steps">{tn.steps}</span>
              </p>
            </div>
          </section>

          {/* ── 도착 ── */}
          <section className="rp rp--finish" data-run="finish" data-done="0">
            <div className="rp__copy finish__copy">
              <h2 className="h2 run__title">
                <span className="line">{fn.title[0]}</span>
                <span className="line line--accent">{fn.title[1]}</span>
              </h2>
              <p className="lede finish__lede">{fn.lede}</p>
              <p className="finish__total">
                <span className="finish__total-label">{fn.total}</span>
                <span className="finish__total-km num">
                  <span ref={totalRef}>0.00</span>
                  <small>km</small>
                </span>
              </p>
              <ol className="finish__list">
                {order.map((i, rank) => (
                  <li key={i} data-rank={rank} style={{ "--c": CREW_ON_DARK[i] } as CSSProperties}>
                    <span className="finish__who">{t.crew[i]}</span>
                    <span className="finish__km num">{CREW_KM[i].toFixed(2)} km</span>
                    <span className="finish__hl">{fn.highlights[i]}</span>
                    <span className="finish__running">{fn.stillRunning}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 선은 장식이다 — 그리다 실패해도 패널(본문)은 남아야 한다 */}
          {geo && (
            <SafeBoundary>
              <div className="run__ink" ref={inkRef} aria-hidden="true">
                <svg width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`}>
                  <g className="run__halo">
                    {geo.g.runners.map((r, i) => (
                      <path key={i} d={`${r.solid} ${r.walk}`} />
                    ))}
                  </g>
                  {[3, 2, 1, 0].map((i) => (
                    <g key={i} stroke={CREW_ON_DARK[i]} className={`run__runner run__runner--${i}`}>
                      <path d={geo.g.runners[i].solid} className="run__solid" />
                      <path d={geo.g.runners[i].walk} className="run__walk" />
                    </g>
                  ))}
                </svg>
              </div>
              <svg
                className="run__heads"
                ref={headsRef}
                width={geo.w}
                height={geo.h}
                viewBox={`0 0 ${geo.w} ${geo.h}`}
                aria-hidden="true"
              >
                {CREW_ON_DARK.map((c) => (
                  <circle key={c} r="0" fill={c} className="run__head" />
                ))}
              </svg>
            </SafeBoundary>
          )}
        </div>
        <div className="run__speed" aria-hidden="true" />
      </div>
    </section>
  );
}
