import type { CSSProperties } from "react";

/**
 * 경로 한 줄. 그리는 진행은 CSS가 조상의 `--p`로 계산한다(`.route` in course.css).
 *
 * `pathLength=1`로 길이를 정규화해 두면 `stroke-dashoffset` 하나로 "어디까지 그렸는가"가 된다.
 * `start`·`dur`는 진행도 안에서 이 선이 그려지는 구간이고, `len`은 이 사람이 실제로 달린 몫이다 —
 * 가장 오래 달린 사람이 1이고, 먼저 끝낸 사람은 그 비율만큼에서 멈춘다(앱의 리플레이 규칙과 같다).
 */
export default function Route({
  d,
  color,
  start,
  dur,
  len = 1,
  width,
}: {
  d: string;
  color: string;
  start: number;
  dur: number;
  len?: number;
  width: number;
}) {
  const style = { "--a": start, "--d": dur, "--len": len, stroke: color, strokeWidth: width } as CSSProperties;
  return <path d={d} pathLength={1} className="route" style={style} />;
}
