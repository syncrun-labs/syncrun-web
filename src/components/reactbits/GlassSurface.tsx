import { type ReactNode, type CSSProperties, type ElementType } from "react";

/**
 * GlassSurface — Glass.swift srGlass/srGlassCard 의 웹 대응.
 * ultraThin material 감성(backdrop-filter) + 대각 헤어라인(.glass::before).
 * tint를 주면 은은한 색 채움이 얹힌다(선택·강조 표면).
 */

type Props = {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
  radius?: number;
  tint?: string;
  padding?: number | string;
  style?: CSSProperties;
};

export default function GlassSurface({
  children,
  as: Tag = "div",
  className = "",
  radius = 24,
  tint,
  padding,
  style,
}: Props) {
  return (
    <Tag
      className={`glass ${className}`}
      style={{
        borderRadius: radius,
        padding,
        ...(tint
          ? { backgroundColor: tint }
          : null),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
