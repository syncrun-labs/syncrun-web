import type { CSSProperties } from "react";
import type { Fact } from "../../i18n/dict";

/**
 * Facts — 제목 한 줄과 설명 한 문장의 목록. 아이콘은 쓰지 않는다.
 *
 * 두 가지 얼굴이 있다. 같은 목록이 페이지마다 같은 모양으로 반복되면 그 반복이 먼저 읽히기 때문에,
 * 위계가 필요한 자리에만 번호를 준다.
 *   - `numbered` — 01·02·03 과 항목 색 바. 맞댐·러닝 카드 두 곳에만 쓴다.
 *   - `plain`    — 번호 없이 굵은 제목과 짧은 색 규칙선.
 *
 * 색은 항목의 runner 인덱스(러너 팔레트)를 따르고, 없으면 코랄이다.
 */
export default function Facts({
  items,
  columns = 1,
  variant = "numbered",
  className = "",
}: {
  items: (Fact & { runner?: number })[];
  columns?: 1 | 2 | 3;
  variant?: "numbered" | "plain";
  className?: string;
}) {
  const List = variant === "numbered" ? "ol" : "ul";
  const cls = ["facts", `facts--${variant}`, columns > 1 ? `facts--${columns}col` : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <List className={cls}>
      {items.map((f, i) => (
        <li
          key={f.k}
          className="facts__item"
          style={f.runner === undefined ? undefined : ({ "--bar": `var(--runner-${f.runner})` } as CSSProperties)}
        >
          {variant === "numbered" && (
            <span className="facts__n tabular" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
          <b className="facts__k">{f.k}</b>
          <p className="facts__v">{f.v}</p>
        </li>
      ))}
    </List>
  );
}
