import { type ReactNode, type ElementType } from "react";

/**
 * StarBorder — React Bits 계열. 캡슐 테두리를 따라 코발트 빛 점이 위·아래로 돌며 흐른다.
 * 주 CTA를 감싸 시선을 끈다.
 */

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  color?: string;
  speed?: string;
  href?: string;
};

export default function StarBorder({
  children,
  as: Tag = "button",
  className = "",
  color = "#8A98FF",
  speed = "5s",
  href,
}: Props) {
  const extra = href ? { href } : {};
  return (
    <Tag className={`star-border ${className}`} {...extra}>
      <span
        className="star-border__travel star-border__bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 12%)`,
          animationDuration: speed,
        }}
      />
      <span
        className="star-border__travel star-border__top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 12%)`,
          animationDuration: speed,
        }}
      />
      <span className="star-border__inner">{children}</span>
    </Tag>
  );
}
