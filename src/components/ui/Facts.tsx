import type { CSSProperties } from "react";
import type { Fact } from "../../i18n/dict";

/**
 * Facts — 번호 목록. 아이콘 대신 01·02·03 숫자와 짧은 색 바로 위계를 만든다.
 * 색은 항목의 runner 인덱스(러너 팔레트)를 따르고, 없으면 코랄이다.
 */
export default function Facts({
  items,
  columns = 1,
  className = "",
}: {
  items: (Fact & { runner?: number })[];
  columns?: 1 | 2;
  className?: string;
}) {
  return (
    <ol className={`facts${columns === 2 ? " facts--2col" : ""} ${className}`.trim()}>
      {items.map((f, i) => (
        <li
          key={f.k}
          className="facts__item"
          style={f.runner === undefined ? undefined : ({ "--bar": `var(--runner-${f.runner})` } as CSSProperties)}
        >
          <span className="facts__n tabular" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <b className="facts__k">{f.k}</b>
          <p className="facts__v">{f.v}</p>
        </li>
      ))}
    </ol>
  );
}
