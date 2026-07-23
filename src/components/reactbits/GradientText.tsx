import { type ReactNode } from "react";

/**
 * GradientText — React Bits 계열. 러너 팔레트 그라데이션을 텍스트에 클립한다.
 * 기본값은 코발트 → 바이올렛 시그니처.
 */

type Props = {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animate?: boolean;
};

export default function GradientText({
  children,
  className = "",
  colors = ["#5264E8", "#7C5CF5", "#A24BE0", "#5264E8", "#7C5CF5"],
  animate = true,
}: Props) {
  return (
    <span
      className={`gradient-text ${animate ? "gradient-text--animate" : ""} ${className}`}
      style={{ backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})` }}
    >
      {children}
    </span>
  );
}
