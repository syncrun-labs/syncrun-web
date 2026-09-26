/**
 * 코스를 가로지르는 선들의 모양.
 *
 * 점은 픽셀이 아니라 "어느 패널의 어디쯤"(패널 키, 가로 비율, 세로 비율)으로 적는다.
 * 패널 폭은 화면마다 다르므로 실제 좌표는 렌더된 패널을 재서 런타임에 푼다 — 선이 언제나 사진 속
 * 같은 자리(폰이 모이는 한가운데, 출발선, 터널 바닥)를 지난다.
 *
 * 선은 두 토막이다.
 *  - 출발 전: 나는 첫 화면부터 걸어오고, 셋은 모으기 사진의 위·아래에서 들어와 한 점에서 만난다.
 *  - 러닝: 출발선에서 넷이 나란히 출발해 "함께"에서 벌어지고, 터널에서는 점선이 되고,
 *    각자 달린 몫(`CREW_LEN`)만큼 가서 멈춘다. 가장 오래 달린 사람(나)이 전체 길이를 정한다.
 */

import { CREW_LEN } from "../scenes/crew";

export type PanelKey = "hero" | "gtext" | "gphoto" | "count" | "sphoto" | "together" | "tunnel" | "card" | "cta";
export type Anchor = readonly [PanelKey, number, number];
export type Box = { x: number; w: number };
export type Resolve = (a: Anchor) => [number, number];

type P = [number, number];

/* ---------------------------------------------------------------- 좌표 */
const APPROACH_ME: Anchor[] = [
  ["hero", 0.04, 0.83],
  ["hero", 0.3, 0.79],
  ["hero", 0.62, 0.86],
  ["hero", 0.92, 0.8],
  ["gtext", 0.4, 0.88],
  ["gtext", 0.9, 0.74],
  ["gphoto", 0.5, 0.5],
];

/** 모으기 사진의 위·아래에서 들어오는 셋. 끝점은 모두 사진 한가운데다 — 선은 왼쪽부터 드러나므로 전부 왼쪽에서 온다 */
const APPROACH_CREW: Anchor[][] = [
  [
    ["gphoto", 0.22, -0.04],
    ["gphoto", 0.34, 0.22],
    ["gphoto", 0.5, 0.5],
  ],
  [
    ["gphoto", 0.02, 1.03],
    ["gphoto", 0.3, 0.8],
    ["gphoto", 0.5, 0.5],
  ],
  [
    ["gtext", 0.7, -0.03],
    ["gphoto", 0.12, 0.2],
    ["gphoto", 0.5, 0.5],
  ],
];

/** 러닝의 가운데 줄. 넷은 여기서 조금씩 비껴 달린다 */
const RUN: Anchor[] = [
  ["sphoto", 0.08, 0.86],
  ["sphoto", 0.55, 0.85],
  ["together", 0.05, 0.8],
  ["together", 0.5, 0.74],
  ["together", 0.96, 0.8],
  ["tunnel", 0.3, 0.82],
  ["tunnel", 0.72, 0.76],
  ["card", 0.12, 0.8],
  ["card", 0.42, 0.78],
];

/** 가운데 줄에서의 기본 간격(px). 0번이 나라 가운데에 선다 */
const LANE = [0, -9, 9, 18] as const;

/** 간격을 몇 배로 벌릴지 — 출발선에서는 붙어 있고 "함께"에서 가장 멀어졌다가 다시 모인다 */
const SPREAD: [Anchor, number][] = [
  [["sphoto", 0.08, 0], 1],
  [["sphoto", 0.9, 0], 1.2],
  [["together", 0.45, 0], 6],
  [["together", 0.95, 0], 4.5],
  [["tunnel", 0.5, 0], 2],
  [["card", 0.4, 0], 1.6],
];

/** 점선(걸음으로 잰 구간)이 되는 가로 범위 */
const WALK: [Anchor, Anchor] = [
  ["tunnel", 0.16, 0],
  ["tunnel", 0.84, 0],
];

/* ---------------------------------------------------------------- 도구 */
const STEP = 6; // 표본 간격(px)

/** Catmull-Rom 을 촘촘한 점으로 편다 */
function sample(pts: P[]): P[] {
  const out: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / STEP));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

const toD = (pts: P[]) =>
  pts.length < 2 ? "" : "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L");

/** 피스와이즈 선형 */
function lerpTable(table: [number, number][], x: number): number {
  if (x <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    const [x1, y1] = table[i];
    const [x0, y0] = table[i - 1];
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0 || 1)) * (y1 - y0);
  }
  return table[table.length - 1][1];
}

/* ---------------------------------------------------------------- 결과 */
export interface Runner {
  /** 실선 — 출발 전 토막과 러닝 토막(점선 구간 제외) */
  solid: string;
  /** 점선 — 터널 안 */
  walk: string;
  /** 머리 점의 위치를 찾기 위한 x 정렬 표본(러닝 토막 + 출발 전 토막) */
  track: P[];
  /** 이 사람의 러닝이 끝난 x */
  endX: number;
}

export interface Geometry {
  runners: Runner[];
  /** 러닝이 시작되는 x(출발선)와 가장 오래 달린 사람이 멈춘 x — 도크의 거리·시간이 이 사이를 잰다 */
  startX: number;
  finishX: number;
  walk: [number, number];
}

export function buildGeometry(resolve: Resolve): Geometry {
  const center = sample(RUN.map(resolve));
  const startX = center[0][0];
  const fullEnd = center[center.length - 1][0];
  const spread = SPREAD.map(([a, k]) => [resolve(a)[0], k] as [number, number]);
  const walk: [number, number] = [resolve(WALK[0])[0], resolve(WALK[1])[0]];

  const approaches = [sample(APPROACH_ME.map(resolve)), ...APPROACH_CREW.map((a) => sample(a.map(resolve)))];

  const runners = LANE.map((lane, i) => {
    const endX = startX + CREW_LEN[i] * (fullEnd - startX);
    const run: P[] = [];
    for (const [x, y] of center) {
      if (x > endX) break;
      run.push([x, y + lane * lerpTable(spread, x)]);
    }

    const before = run.filter(([x]) => x < walk[0]);
    const inside = run.filter(([x]) => x >= walk[0] - STEP && x <= walk[1] + STEP);
    const after = run.filter(([x]) => x > walk[1]);
    const solid = [toD(approaches[i]), toD(before), toD(after)].filter(Boolean).join(" ");

    return { solid, walk: toD(inside), track: [...approaches[i], ...run].sort((a, b) => a[0] - b[0]), endX };
  });

  return { runners, startX, finishX: fullEnd, walk };
}

/** 정렬된 표본에서 x 의 y. 범위 밖이면 null */
export function yAt(track: P[], x: number): number | null {
  if (!track.length || x < track[0][0]) return null;
  if (x >= track[track.length - 1][0]) return track[track.length - 1][1];
  let lo = 0;
  let hi = track.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (track[mid][0] <= x) lo = mid;
    else hi = mid;
  }
  const [x0, y0] = track[lo];
  const [x1, y1] = track[hi];
  return y0 + ((x - x0) / (x1 - x0 || 1)) * (y1 - y0);
}
