import { useEffect, useRef, useState } from "react";
import { buildGeometry, yAt, type Anchor, type Geometry, type PanelKey } from "./geometry";
import { Panels } from "./Panels";
import Dock, { type DockHandle } from "./Dock";
import TopBar from "./TopBar";
import SafeBoundary from "../reactbits/SafeBoundary";
import { CREW_KM, CREW_ON_DARK } from "../scenes/crew";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * 코스 — 페이지 전체가 한 번의 러닝이다.
 *
 * 아래로 스크롤하면 긴 띠가 오른쪽으로 흐른다. 띠 위를 선 하나가 처음부터 끝까지 가로지르고,
 * 화면 한가운데가 "지금 달리는 자리"다 — 선은 거기까지만 그려져 있고 끝에 머리 점이 붙는다.
 * 스크롤을 가로채지 않는다: 띠를 담은 무대가 `position: sticky`고 코스 높이가 띠 길이만큼이라
 * 네이티브 스크롤 1px 이 띠 1px 이다. 되감기도, 키보드·스크롤바 이동도 그대로 된다.
 *
 * 축소 모션·`?reveal=all`에서는 띠가 세로로 풀려 패널이 한 장씩 쌓인다(선은 그리지 않는다).
 *
 * 패널마다 `--lp`(0~1)가 흐른다 — 패널 왼쪽 끝이 화면 오른쪽에 들어올 때 0, 오른쪽 끝이 화면 왼쪽으로
 * 나갈 때 1, 한가운데를 지날 때 0.5. 사진의 패럴랙스·폰 화면·카드 재생이 전부 이 값을 쓴다.
 */

/** 도크의 장(章) — 눈금을 누르면 그 패널로 간다 */
const CHAPTERS: PanelKey[] = ["hero", "gtext", "count", "together", "tunnel", "card"];

const TAU = 0.085; // 감쇠 시상수(초)
const JOIN = [0.4, 0.45, 0.5] as const; // 모으기 사진이 이 지점을 지날 때 한 명씩 붙는다
const RUN_SECONDS = 31 * 60 + 26; // 5.24km 를 6'00"/km 로

export default function Course() {
  const courseRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const headsRef = useRef<SVGSVGElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const tunnelKmRef = useRef<HTMLSpanElement>(null);
  const dockRef = useRef<DockHandle>(null);
  const [geo, setGeo] = useState<{ g: Geometry; w: number; h: number } | null>(null);
  const stillRef = useRef(false);

  useEffect(() => {
    const course = courseRef.current;
    const strip = stripRef.current;
    if (!course || !strip) return;

    const panels = Array.from(strip.querySelectorAll<HTMLElement>("[data-panel]"));
    const byKey = new Map(panels.map((p) => [p.dataset.panel as PanelKey, p]));
    const gphoto = byKey.get("gphoto");
    const tunnel = byKey.get("tunnel");

    if (shouldSkipReveal()) {
      stillRef.current = true;
      course.classList.add("is-still");
      panels.forEach((p) => p.style.setProperty("--lp", "1"));
      if (gphoto) gphoto.dataset.count = "4";
      if (countRef.current) countRef.current.textContent = "4";
      if (tunnel) tunnel.dataset.mode = "steps";
      if (tunnelKmRef.current) tunnelKmRef.current.textContent = (CREW_KM[0] * 0.7).toFixed(2);
      dockRef.current?.update({ progress: 1, chapter: CHAPTERS.length - 1, km: CREW_KM[0], seconds: RUN_SECONDS });
      return;
    }

    /* ── 측정 ───────────────────────────────────────────── */
    let vw = 0;
    let vh = 0;
    let stripW = 0;
    let boxes = new Map<PanelKey, { x: number; w: number }>();
    let g: Geometry | null = null;
    let gatherX = 0;

    const measure = () => {
      vw = document.documentElement.clientWidth;
      vh = window.innerHeight;
      stripW = strip.scrollWidth;
      course.style.height = `${stripW - vw + vh}px`;
      boxes = new Map(panels.map((p) => [p.dataset.panel as PanelKey, { x: p.offsetLeft, w: p.offsetWidth }]));
      const resolve = ([k, fx, fy]: Anchor): [number, number] => {
        const b = boxes.get(k)!;
        return [b.x + fx * b.w, fy * vh];
      };
      g = buildGeometry(resolve);
      gatherX = resolve(["gphoto", 0.5, 0.5])[0];
      setGeo({ g, w: stripW, h: vh });
    };
    /* ── 프레임 ─────────────────────────────────────────── */
    let sx = -1;
    let raf = 0;
    let last = 0;

    const draw = () => {
      if (!g) return;
      const clipX = sx + vw / 2;
      strip.style.transform = `translate3d(${-sx}px,0,0)`;
      if (inkRef.current) inkRef.current.style.width = `${clipX}px`;

      for (const p of panels) {
        const b = boxes.get(p.dataset.panel as PanelKey)!;
        const lp = Math.min(1, Math.max(0, (vw - (b.x - sx)) / (vw + b.w)));
        p.style.setProperty("--lp", lp.toFixed(4));
        if (p === gphoto) {
          const n = String(1 + JOIN.filter((a) => lp >= a).length);
          if (p.dataset.count !== n) {
            p.dataset.count = n;
            if (countRef.current) countRef.current.textContent = n;
          }
        }
      }

      const inWalk = clipX >= g.walk[0] && clipX <= g.walk[1];
      if (tunnel) tunnel.dataset.mode = inWalk ? "steps" : "gps";

      // 머리 점 — 출발 전에 모인 뒤 출발선까지(카운트다운 구간)는 선이 없으니 점도 숨긴다
      const heads = headsRef.current?.children;
      if (heads) {
        g.runners.forEach((r, i) => {
          const c = heads[i] as SVGCircleElement | undefined;
          if (!c) return;
          const x = Math.min(clipX, r.endX);
          const y = yAt(r.track, x);
          const waiting = clipX > gatherX && clipX < g!.startX;
          if (y === null || waiting) {
            c.setAttribute("r", "0");
            return;
          }
          c.setAttribute("cx", x.toFixed(1));
          c.setAttribute("cy", y.toFixed(1));
          c.setAttribute("r", i === 0 ? "7" : "6");
        });
      }

      const f = Math.min(1, Math.max(0, (clipX - g.startX) / (g.finishX - g.startX)));
      if (tunnelKmRef.current) tunnelKmRef.current.textContent = (CREW_KM[0] * f).toFixed(2);
      // 도크 눈금은 등간격이라 픽셀 진행도가 아니라 "몇 번째 장의 어디쯤"으로 채운다
      const xs = CHAPTERS.map((k) => boxes.get(k)?.x ?? 0);
      let chapter = 0;
      xs.forEach((x, i) => {
        if (x <= clipX) chapter = i;
      });
      const next = xs[chapter + 1] ?? stripW;
      const within = Math.min(1, Math.max(0, (clipX - xs[chapter]) / Math.max(1, next - xs[chapter])));
      dockRef.current?.update({
        progress: Math.min(1, (chapter + within) / (CHAPTERS.length - 1)),
        chapter,
        km: CREW_KM[0] * f,
        seconds: RUN_SECONDS * f,
      });
    };

    const target = () => {
      const top = course.getBoundingClientRect().top;
      return Math.min(stripW - vw, Math.max(0, -top));
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      const goal = target();
      if (sx < 0 || Math.abs(goal - sx) > vw * 1.5) sx = goal;
      else sx += (goal - sx) * (1 - Math.exp(-dt / TAU));
      if (Math.abs(goal - sx) < 0.3) sx = goal;
      draw();
      raf = requestAnimationFrame(tick);
    };
    // 첫 측정은 다음 프레임에 — 효과 본문에서 상태를 바로 바꾸지 않는다
    raf = requestAnimationFrame(() => {
      measure();
      raf = requestAnimationFrame(tick);
    });

    const onResize = () => {
      measure();
      sx = target();
      draw();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  /** 장 눈금 → 그 패널의 왼쪽 끝이 화면 왼쪽에 오는 스크롤 위치 */
  const jump = (i: number) => {
    const course = courseRef.current;
    const panel = stripRef.current?.querySelector<HTMLElement>(`[data-panel="${CHAPTERS[i]}"]`);
    if (!course || !panel) return;
    const top = course.getBoundingClientRect().top + window.scrollY;
    const y = stillRef.current ? panel.getBoundingClientRect().top + window.scrollY : top + panel.offsetLeft;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      <TopBar />
      <div className="course" ref={courseRef}>
        <div className="course__view">
          <div className="course__strip" ref={stripRef}>
            <Panels countRef={countRef} tunnelKmRef={tunnelKmRef} />

            {/* 선은 장식이다 — 그리다 실패해도 패널(본문)은 남아야 한다 */}
            {geo && (
              <SafeBoundary>
                <div className="course__ink" ref={inkRef} aria-hidden="true">
                  <svg width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`}>
                    {/* 밝은 패널 위에서도 선이 서도록 어두운 테두리를 먼저 깐다 */}
                    <g className="course__halo">
                      {geo.g.runners.map((r, i) => (
                        <path key={i} d={`${r.solid} ${r.walk}`} />
                      ))}
                    </g>
                    {[3, 2, 1, 0].map((i) => (
                      <g key={i} stroke={CREW_ON_DARK[i]} className={`course__runner course__runner--${i}`}>
                        <path d={geo.g.runners[i].solid} className="course__solid" />
                        <path d={geo.g.runners[i].walk} className="course__walk" />
                      </g>
                    ))}
                  </svg>
                </div>
                <svg
                  className="course__heads"
                  ref={headsRef}
                  width={geo.w}
                  height={geo.h}
                  viewBox={`0 0 ${geo.w} ${geo.h}`}
                  aria-hidden="true"
                >
                  {CREW_ON_DARK.map((c, i) => (
                    <circle key={c} r="0" fill={c} className={`course__head course__head--${i}`} />
                  ))}
                </svg>
              </SafeBoundary>
            )}
          </div>
        </div>
      </div>
      <Dock ref={dockRef} onJump={jump} />
    </>
  );
}
