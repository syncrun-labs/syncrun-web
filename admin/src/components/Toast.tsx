import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface ToastItem {
  id: number;
  text: string;
  tone: "info" | "error";
}

const ToastContext = createContext<(text: string, tone?: ToastItem["tone"]) => void>(() => {});

/** 앱의 showToast — 화면 아래 가운데 유리 캡슐로 잠깐 뜬다. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback((text: string, tone: ToastItem["tone"] = "info") => {
    const id = Date.now() + Math.random();
    setItems((list) => [...list, { id, text, tone }]);
    setTimeout(() => setItems((list) => list.filter((item) => item.id !== id)), 2600);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-host" role="status" aria-live="polite">
        {items.map((item) => (
          <div key={item.id} className={`toast glass toast-${item.tone}`}>
            {item.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
