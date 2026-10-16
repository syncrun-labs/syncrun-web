import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { scrubbers } from "./scrub";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * 패널이 지나가는 만큼 영상이 흐르는 배경.
 *
 * `<video>`의 `currentTime`은 디코더가 키프레임 사이를 뛰지 못해 스크롤 위치에 맞는 장면을 짚지 못한다
 * (docs/adr/0003). 그래서 클립을 프레임 시퀀스(`public/scenes/<name>/f-0000.webp` …)로 미리 뽑아 캔버스에 그린다.
 * 가장 가까운 `[data-scrub-host]`의 진행도를 그 호스트의 루프가 `scrubbers`로 넘기고, `from`~`to` 구간이 첫 장~끝 장이 된다.
 *
 * 포스터(사진)는 항상 깔려 있다 — 시퀀스가 오기 전, 축소 모션, 데이터 절약, 로드 실패 어디서나 이 그림이 남는다.
 * 시퀀스는 패널이 화면 오른쪽 끝에 닿을 때부터 받는다.
 */

const MAX_DPR = 1.5;
const KEY_STRIDE = 6; // 성긴 키프레임부터 받아 확 감아도 근처 장이 잡히게

export default function ScrubFrames({
  name,
  frames,
  from,
  to,
  poster,
  alt,
  priority = false,
  settle = false,
  sizes = "130vw",
}: {
  name: string;
  frames: number;
  from: number;
  to: number;
  poster: StaticImageData;
  alt: string;
  priority?: boolean;
  /** 끝 장에 닿으면 캔버스를 걷어 포스터(원본 사진)를 드러낸다 — 사진 위에 얹는 합성이 원본 좌표에 맞도록 */
  settle?: boolean;
  sizes?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const panel = wrap?.closest<HTMLElement>("[data-scrub-host]");
    if (!wrap || !canvas || !panel) return;
    if (shouldSkipReveal()) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const imgs: (HTMLImageElement | null)[] = new Array(frames).fill(null);
    const src = (i: number) => `/scenes/${name}/f-${String(i).padStart(4, "0")}.webp`;
    let started = false;
    let wanted = 0;
    let drawn = -1;

    const draw = () => {
      // 원하는 장이 아직 없으면 가장 가까운 받은 장
      let img: HTMLImageElement | null = null;
      let at = -1;
      for (let d = 0; d < frames && !img; d++) {
        for (const i of [wanted - d, wanted + d]) {
          if (i >= 0 && i < frames && imgs[i]) {
            img = imgs[i];
            at = i;
            break;
          }
        }
      }
      if (!img || at === drawn) return;
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      const w = Math.round(wrap.clientWidth * dpr);
      const h = Math.round(wrap.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      drawn = at;
      canvas.dataset.frame = String(at);
      canvas.classList.add("is-live");
    };

    const load = () => {
      started = true;
      const order: number[] = [];
      for (let i = 0; i < frames; i += KEY_STRIDE) order.push(i);
      for (let i = 0; i < frames; i++) if (i % KEY_STRIDE) order.push(i);
      for (const i of order) {
        const img = new window.Image();
        img.decoding = "async";
        img.onload = () => {
          imgs[i] = img;
          draw();
        };
        img.src = src(i);
      }
    };

    scrubbers.set(panel, (lp) => {
      if (!started && lp > 0.001) load();
      const t = Math.min(1, Math.max(0, (lp - from) / (to - from)));
      if (settle) canvas.classList.toggle("is-settled", t >= 1);
      const next = Math.round(t * (frames - 1));
      if (next !== wanted) {
        wanted = next;
        draw();
      }
    });

    const ro = new ResizeObserver(() => {
      drawn = -1;
      draw();
    });
    ro.observe(wrap);

    return () => {
      scrubbers.delete(panel);
      ro.disconnect();
    };
  }, [name, frames, from, to, settle]);

  return (
    <div className="scrub" ref={wrapRef}>
      <Image src={poster} alt={alt} fill priority={priority} sizes={sizes} className="pnl__img" />
      <canvas className="scrub__canvas" ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
