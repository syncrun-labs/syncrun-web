import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./ui.css";

export interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "glass" | "quiet" | "danger";
  loading?: boolean;
  children: ReactNode;
}

/** 앱의 PrimaryPillButton — 캡슐, 누르면 살짝 줄어든다. 로딩 중에는 눌리지 않는다. */
export function PillButton({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  type = "button",
  ...rest
}: PillButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={`pill pill-${variant} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? <span className="pill-spinner" aria-hidden="true" /> : null}
      <span className={loading ? "pill-label is-loading" : "pill-label"}>{children}</span>
    </button>
  );
}
