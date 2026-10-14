import { useEffect, type ReactNode } from "react";
import { PillButton } from "./PillButton";

export interface ConfirmSheetProps {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 되돌릴 수 없는 일(발송 · 예약 · 취소) 앞의 확인 단계. Esc · 바깥 누르기로 닫힌다. */
export function ConfirmSheet({ title, children, confirmLabel, busy, onConfirm, onCancel }: ConfirmSheetProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  return (
    <div className="sheet-backdrop" onMouseDown={() => !busy && onCancel()}>
      <div
        className="sheet glass glass-card"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2>{title}</h2>
        <div>{children}</div>
        <div className="sheet-actions">
          <PillButton variant="quiet" onClick={onCancel} disabled={busy}>
            취소
          </PillButton>
          <PillButton onClick={onConfirm} loading={busy}>
            {confirmLabel}
          </PillButton>
        </div>
      </div>
    </div>
  );
}
