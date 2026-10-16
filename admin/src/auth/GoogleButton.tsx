import { useEffect, useRef } from "react";

interface GoogleId {
  initialize: (config: { client_id: string; callback: (r: { credential: string }) => void; hd?: string }) => void;
  renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function loadScript(): Promise<void> {
  if (window.google?.accounts) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("google script failed")));
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

/** Google Identity Services 버튼. 받은 ID 토큰을 그대로 넘긴다 — 검증은 서버가 한다(계약 §21.1). */
export function GoogleButton({
  clientId,
  onCredential,
  onError,
}: {
  clientId: string;
  onCredential: (idToken: string) => void;
  onError: (message: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    loadScript().then(
      () => {
        if (!alive || !ref.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          hd: "syncrunlabs.com",
          callback: (response) => onCredential(response.credential),
        });
        window.google.accounts.id.renderButton(ref.current, {
          theme: "filled_black",
          shape: "pill",
          size: "large",
          text: "signin_with",
          locale: "ko",
          width: 280,
        });
      },
      () => alive && onError("구글 로그인을 불러오지 못했어요"),
    );
    return () => {
      alive = false;
    };
  }, [clientId, onCredential, onError]);

  return <div ref={ref} />;
}
