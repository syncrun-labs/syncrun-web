import Route from "./Route";
import { CREW_KM, CREW_LEN, CREW_ON_CORAL, CREW_TOTAL, LOOP, LOOP_OFFSETS } from "./crew";

/**
 * 단체 러닝 카드 — 앱의 시그니처 배경(코랄 위에 경로만)을 SVG로 그린 것.
 * 항목과 자리는 앱의 단체 카드와 같다: 위에 날짜·오늘 우리, 아래에 합산 거리·평균 페이스·러너 수·범례, 구석에 워터마크.
 * 지도는 없다 — 기본 카드는 경로 모양만 담는다.
 *
 * 경로의 그리는 진행은 조상의 `--p`를 따른다. `still`이면 완주 상태로 고정한다(공유 이미지처럼).
 */
export default function RunCardArt({
  date,
  together,
  pace,
  runners,
  names,
  still = false,
}: {
  date: string;
  together: string;
  pace: string;
  runners: string;
  names: readonly string[];
  still?: boolean;
}) {
  return (
    <svg className={still ? "runcard-art runcard-art--still" : "runcard-art"} viewBox="0 0 300 400">
      <rect width="300" height="400" rx="20" fill="#dc565b" />
      <text x="20" y="32" className="runcard-art__meta">
        {date}
      </text>
      <text x="280" y="32" textAnchor="end" className="runcard-art__meta">
        {together} {CREW_TOTAL.toFixed(1)}km
      </text>

      <g transform="translate(128 58) scale(0.3)">
        {[3, 2, 1, 0].map((i) => (
          <g key={i} transform={`translate(${LOOP_OFFSETS[i][0] * 1.6} ${LOOP_OFFSETS[i][1] * 1.6})`}>
            <Route d={LOOP} color={CREW_ON_CORAL[i]} start={0} dur={1} len={CREW_LEN[i]} width={i === 0 ? 13 : 11} />
          </g>
        ))}
      </g>

      <text x="20" y="300" className="runcard-art__km">
        {CREW_TOTAL.toFixed(2)}
        <tspan className="runcard-art__unit" dx="4">
          km
        </tspan>
      </text>
      <text x="20" y="330" className="runcard-art__stat">
        5&apos;38&quot;
      </text>
      <text x="20" y="344" className="runcard-art__label">
        {pace}
      </text>
      <text x="92" y="330" className="runcard-art__stat">
        {names.length}
      </text>
      <text x="92" y="344" className="runcard-art__label">
        {runners}
      </text>

      <g transform="translate(20 372)">
        {names.map((n, i) => (
          <g key={n} transform={`translate(${i * 52} 0)`}>
            <circle r="3.2" cx="3" cy="-3.5" fill={CREW_ON_CORAL[i]} />
            <text x="10" y="0" className="runcard-art__legend">
              {n}
            </text>
          </g>
        ))}
      </g>
      <text x="280" y="378" textAnchor="end" className="runcard-art__mark">
        SyncRun
      </text>
      <title>{`${CREW_KM.map((k, i) => `${names[i]} ${k.toFixed(2)}km`).join(", ")}`}</title>
    </svg>
  );
}
