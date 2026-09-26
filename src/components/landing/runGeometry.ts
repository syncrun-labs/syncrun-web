/**
 * 달리기 구간(가로 띠)을 가로지르는 네 선의 모양.
 *
 * 점은 픽셀이 아니라 "어느 패널의 어디쯤"(패널 키, 가로 비율, 세로 비율)으로 적고 렌더된 패널을 재서 푼다 —
 * 화면 폭이 달라도 선이 같은 자리(터널 바닥, 도착 패널의 숫자 아래)를 지난다.
 * 넷은 화면 왼쪽 끝에서 나란히 들어와(3·2·1에서 출발한 그 선들) "함께"에서 벌어지고, 터널에서 점선이 되고,
 * 각자 달린 몫(`CREW_LEN`)만큼 가서 멈춘다. 가장 오래 달린 사람(나)이 전체 길이를 정한다.
 */

import { CREW_LEN } from "../scenes/crew";

export type RunPanel = "together" | "tunnel" | "finish";
export type Anchor = readonly [RunPanel, number, number];
export type Resolve = (a: Anchor) => [number, number];

type P = [number, number];

/** 가운데 줄 */
const RUN: Anchor[] = [
  ["together", -0.02, 0.84],
  ["together", 0.3, 0.8],
  ["together", 0.62, 0.72],
  ["together", 0.98, 0.8],
  ["tunnel", 0.3, 0.82],
  ["tunnel", 0.72, 0.76],
  ["finish", 0.2, 0.88],
  ["finish", 0.6, 0.9],
];

/** 가운데 줄에서의 기본 간격(px). 0번이 나라 가운데에 선다 */
const LANE = [0, -9, 9, 18] as const;

/** 간격을 몇 배로 벌릴지 — 들어올 때는 붙어 있고 "함께"에서 가장 멀어졌다가 다시 모인다 */
const SPREAD: [Anchor, number][] = [
  [["together", 0, 0], 1],
  [["together", 0.55, 0], 6],
  [["together", 0.95, 0], 4.5],
  [["tunnel", 0.5, 0], 2],
  [["finish", 0.4, 0], 1.6],
];

/** 점선(걸음으로 잰 구간)이 되는 가로 범위 */
const WALK: [Anchor, Anchor] = [
  ["tunnel", 0.16, 0],
  ["tunnel", 0.84, 0],
];

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

function lerpTable(table: [number, number][], x: number): number {
  if (x <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    const [x1, y1] = table[i];
    const [x0, y0] = table[i - 1];
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0 || 1)) * (y1 - y0);
  }
  return table[table.length - 1][1];
}

export interface Runner {
  /** 실선 — 점선 구간을 뺀 러닝 */
  solid: string;
  /** 점선 — 터널 안 */
  walk: string;
  /** 머리 점 위치를 찾기 위한 x 정렬 표본 */
  track: P[];
  /** 이 사람이 멈춘 x */
  endX: number;
}

export interface RunGeometry {
  runners: Runner[];
  startX: number;
  finishX: number;
  walk: [number, number];
}

export function buildRun(resolve: Resolve): RunGeometry {
  const center = sample(RUN.map(resolve));
  const startX = Math.max(0, center[0][0]);
  const fullEnd = center[center.length - 1][0];
  const spread = SPREAD.map(([a, k]) => [resolve(a)[0], k] as [number, number]);
  const walk: [number, number] = [resolve(WALK[0])[0], resolve(WALK[1])[0]];

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
    return { solid: [toD(before), toD(after)].filter(Boolean).join(" "), walk: toD(inside), track: run, endX };
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
