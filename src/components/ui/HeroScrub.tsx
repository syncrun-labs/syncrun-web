import { useEffect, useRef } from "react";
import NextImage from "next/image";
import poster from "@/public/hero/poster.webp";
import manifest from "@/public/hero/manifest.json";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * HeroScrub — 스크롤이 배경 프레임을 넘기고, 카피는 제자리에서 떴다 진다.
 *
 * 무대는 `position: sticky` 로 한 화면에 머물고, 스크롤 진행도가 (1) 프레임 인덱스와
 * (2) 마디 카피의 투명도를 같이 움직인다. 카피가 화면을 따라 흘러가지 않고 같은 자리에서
 * 교차하는 것이 핵심이다 — 영상이 넘어가면서 글자가 등장한다(docs/adr/0003).
 *
 * `<video>` 를 쓰지 않는 이유는 디코더가 키프레임 사이를 뛰지 못해 스크롤 위치에 맞는 프레임을
 * 정확히 짚을 수 없기 때문이다. 블러를 구운 프레임은 고주파 성분이 없어 장당 8KB다.
 *
 * **기본 상태는 스크러빙이 아니다.** 서버가 낸 HTML 은 세 마디가 그냥 쌓인 한 화면짜리 다크
 * 섹션이고, 이 컴포넌트가 마운트되어 `hero--scrub` 클래스를 붙일 때만 무대가 길어진다.
 * 그래서 축소 모션·`?reveal=all`·데이터 절약·JS 실패 어디서나 카피가 온전히 읽힌다.
 *
 * 스크롤을 가로채지 않는다. 네이티브 스크롤이고 역방향도 그대로 돈다.
 */

const FRAMES = manifest.frames;
const LAST = FRAMES - 1;

/* 스크롤 진행도(p) → 프레임 위치(f). 둘 다 0..1 이라 프레임 수가 바뀌어도 그대로 선다.
   원본 클립의 서사와 맞춰 둔다 — 달려온다 → 만난다 → 폰을 모은다 → 함께 간다.
   `f` 가 같은 구간은 정지(hold)다. 프레임은 멈추고 스크롤만 흘러 카피를 읽을 시간이 생긴다. */
const TIMELINE: { p: [number, number]; f: [number, number] }[] = [
  { p: [0.0, 0.24], f: [0.0, 0.3] }, // 달려온다
  { p: [0.24, 0.34], f: [0.3, 0.476] }, // 만난다
  { p: [0.34, 0.46], f: [0.476, 0.622] }, // 폰을 모은다 — 느리게
  { p: [0.46, 0.58], f: [0.622, 0.622] }, // 정지 — 맞댐
  { p: [0.58, 0.82], f: [0.622, 0.952] }, // 함께 간다
  { p: [0.82, 1.0], f: [0.952, 1.0] }, // 마무리
];

/* 마디 카피의 등장·퇴장 구간 [인 시작, 인 끝, 아웃 시작, 아웃 끝].
   첫 마디는 첫 화면부터 떠 있어야 하고, 마지막 마디는 끝까지 남는다(CTA 가 그 안에 있다). */
const CUES: [number, number, number, number][] = [
  [-1, -0.5, 0.22, 0.3],
  [0.33, 0.42, 0.6, 0.68],
  [0.71, 0.8, 2, 3],
];

const TAU = 0.075; // 감쇠 시상수(초). 클수록 무겁다
const SNAP = 0.08; // 이보다 멀리 튀면 감쇠 없이 바로 붙는다
const BLEND_MIN = 0.04; // 이 정도 소수부부터 다음 장을 섞는다
const AHEAD = 40;
const BEHIND = 10;
const MAX_INFLIGHT = 10;
const KEY_STRIDE = 12;
const DECODE_TIMEOUT = 50; // decode() 가 이 안에 안 오면 그냥 진행한다
const MAX_DPR = 2;

const frameSrc = (i: number) => `/hero/seq/f-${String(i).padStart(4, "0")}.webp`;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ramp = (v: number, a: number, b: number) => (b === a ? (v >= b ? 1 : 0) : clamp01((v - a) / (b - a)));

/** 진행도를 타임라인에 태워 프레임 위치(0..1)로 */
function framePos(p: number): number {
  for (const seg of TIMELINE) {
    const [p0, p1] = seg.p;
    if (p <= p1 || seg === TIMELINE[TIMELINE.length - 1]) {
      const t = p1 === p0 ? 1 : clamp01((p - p0) / (p1 - p0));
      return seg.f[0] + (seg.f[1] - seg.f[0]) * t;
    }
  }
  return 1;
}

export default function HeroScrub({ alt }: { alt: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    // 진행도의 기준은 스크롤 구간을 가진 히어로다. 무대는 그 안에 붙어 있을 뿐이다.
    const hero = stage.closest<HTMLElement>(".hero");
    if (!hero) return;

    // 축소 모션·QA·데이터 절약에서는 스크러빙을 켜지 않는다. 쌓인 카피가 그대로 남는다.
    if (shouldSkipReveal()) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const beats = Array.from(hero.querySelectorAll<HTMLElement>(".hero__beat"));

    // 여기서부터 무대가 길어진다 — 이 클래스가 붙어야 sticky·절대배치가 산다
    hero.classList.add("hero--scrub");

    let alive = true;

    /* ── 로더 ─────────────────────────────────────────────── */
    const cache = new Map<number, HTMLImageElement>();
    const inflight = new Set<number>();
    const failed = new Set<number>();
    // 전 구간에 걸친 성긴 키프레임. 확 감아도 근처 장이 잡히도록 캐시에서 빼지 않는다.
    const pinned = new Set<number>();
    for (let i = 0; i <= LAST; i += KEY_STRIDE) pinned.add(i);
    pinned.add(LAST);

    const load = (i: number) => {
      if (i < 0 || i > LAST) return;
      if (cache.has(i) || inflight.has(i) || failed.has(i)) return;
      if (inflight.size >= MAX_INFLIGHT) return;
      inflight.add(i);
      const img = document.createElement("img");
      img.decoding = "async";
      img.src = frameSrc(i);
      // decode() 가 문서에 붙지 않은 이미지에서 영영 resolve 되지 않는 브라우저가 있다.
      // 짧은 타임아웃과 경주시켜 로더가 통째로 멈추지 않게 한다.
      const settle = () => {
        inflight.delete(i);
        if (!alive) return;
        if (img.naturalWidth) cache.set(i, img);
        else failed.add(i);
      };
      const decoded = img.decode ? img.decode() : Promise.resolve();
      Promise.race([decoded, new Promise((r) => setTimeout(r, DECODE_TIMEOUT))]).then(settle, settle);
    };

    let fillCursor = 0;
    const pump = (center: number, forward: boolean) => {
      const step = forward ? 1 : -1;
      const ahead = forward ? AHEAD : BEHIND;
      const behind = forward ? BEHIND : AHEAD;
      for (let d = 0; d <= ahead; d++) load(center + d * step);
      for (let d = 1; d <= behind; d++) load(center - d * step);
      for (const k of pinned) load(k);
      // 급한 요청이 없으면 유휴 대역으로 전체를 채운다 — 한 번 다 받으면 어떻게 감아도 끊기지 않는다
      let guard = 0;
      while (inflight.size < MAX_INFLIGHT && guard++ < FRAMES) {
        load(fillCursor);
        fillCursor = (fillCursor + 1) % FRAMES;
      }
    };

    /** i 에서 가장 가까운, 이미 받아둔 프레임 */
    const nearest = (i: number): HTMLImageElement | null => {
      const c = Math.max(0, Math.min(LAST, Math.round(i)));
      const hit = cache.get(c);
      if (hit) return hit;
      for (let d = 1; d <= FRAMES; d++) {
        const a = cache.get(c - d);
        if (a) return a;
        const b = cache.get(c + d);
        if (b) return b;
      }
      return null;
    };

    /* ── 캔버스 ───────────────────────────────────────────── */
    let cw = 0;
    let ch = 0;
    let dirty = true; // 캔버스 크기를 바꾸면 내용이 지워진다 — 다시 그리게 표시한다

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const nw = Math.round(w * dpr);
      const nh = Math.round(h * dpr);
      if (canvas.width === nw && canvas.height === nh) return;
      canvas.width = nw;
      canvas.height = nh;
      cw = nw;
      ch = nh;
      dirty = true;
    };

    /** cover 로 그린다 — 비율이 달라도 잘려 채워진다 */
    const paint = (img: HTMLImageElement, alpha: number) => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih || !cw || !ch) return;
      const s = Math.max(cw / iw, ch / ih);
      const dw = iw * s;
      const dh = ih * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    /* ── 진행도 ───────────────────────────────────────────── */
    /** 히어로 안에서의 스크롤 진행도 0..1 — 무대가 붙어 있는 구간이 전부다 */
    const target = () => {
      const r = hero.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      if (range <= 0) return 0;
      return clamp01(-r.top / range);
    };

    let cur = target();
    let last = performance.now();
    let drawn = -1;
    let raf = 0;
    let shown = false;

    /** 마디 카피 — 같은 자리에서 떴다 진다. 화면을 따라 흘러가지 않는다. */
    const cue = (p: number) => {
      beats.forEach((el, i) => {
        const c = CUES[i];
        if (!c) return;
        const o = ramp(p, c[0], c[1]) * (1 - ramp(p, c[2], c[3]));
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - o) * 14).toFixed(1)}px, 0)`;
        // 보이지 않는 마디는 탭 순서에서도 빠진다
        el.style.visibility = o < 0.02 ? "hidden" : "visible";
      });
    };

    const tick = (now: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(tick);

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const t = target();
      const gap = t - cur;
      // 감쇠는 지수적으로 — 프레임 간격이 흔들려도 같은 무게가 된다
      cur = Math.abs(gap) > SNAP ? t : cur + gap * (1 - Math.exp(-dt / TAU));

      resize();
      cue(cur);

      const pos = framePos(cur) * LAST;
      const i0 = Math.floor(pos);
      const frac = pos - i0;
      const forward = gap >= 0;

      const a = nearest(i0);
      if (!a) {
        pump(i0, forward);
        return;
      }

      const key = Math.round(pos * 100);
      if (dirty || key !== drawn) {
        drawn = key;
        dirty = false;
        paint(a, 1);
        // 사이를 알파로 메운다 — 정확한 두 장이 다 캐시에 있을 때만.
        // 멀리 떨어진 장을 섞으면 잔상이 된다.
        if (frac > BLEND_MIN && cache.get(i0) === a) {
          const b = cache.get(i0 + 1);
          if (b) paint(b, frac);
        }
        if (!shown) {
          shown = true;
          canvas.style.opacity = "1";
        }
      }

      pump(i0, forward);
    };

    resize();
    cue(cur);
    pump(0, true);
    raf = requestAnimationFrame(tick);

    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      hero.classList.remove("hero--scrub");
      for (const el of beats) {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.visibility = "";
      }
      cache.clear();
      inflight.clear();
    };
  }, []);

  return (
    // 배경이지만 제품의 이야기를 담고 있어 장식으로 숨기지 않는다 — 한 장의 그림으로 읽힌다.
    <div className="hero__backdrop" ref={stageRef} role="img" aria-label={alt}>
      {/* 포스터는 항상 깔려 있다. 캔버스는 첫 프레임을 그린 뒤에야 위를 덮는다. */}
      <NextImage src={poster} alt="" fill sizes="100vw" priority className="hero__poster" aria-hidden="true" />
      <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero__scrim" />
    </div>
  );
}
