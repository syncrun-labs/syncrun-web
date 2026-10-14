import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ApiError } from "../api/client";
import { GoogleButton } from "../auth/GoogleButton";
import { useAuth } from "../auth/auth";
import { PillButton } from "../components/PillButton";
import { Logo } from "../components/Logo";

export function LoginPage() {
  const { signIn, isMock } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const next = params.get("next") ?? "/";

  const submit = useCallback(
    async (idToken: string) => {
      setBusy(true);
      setError(null);
      try {
        await signIn(idToken);
        navigate(next.startsWith("/") ? next : "/", { replace: true });
      } catch (e) {
        setError(
          e instanceof ApiError && e.status === 401
            ? "이 계정은 운영 명단에 없어요"
            : "로그인하지 못했어요. 잠시 뒤 다시 시도해 주세요",
        );
      } finally {
        setBusy(false);
      }
    },
    [navigate, next, signIn],
  );

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <main className="login">
      <div className="ambient" aria-hidden="true" />
      <section className="login-card glass glass-card">
        <Logo size={44} />
        <h1>운영</h1>
        <p>회사 구글 계정으로 들어와요.</p>
        {isMock ? (
          <PillButton onClick={() => submit("dev")} loading={busy}>
            개발 로그인
          </PillButton>
        ) : clientId ? (
          <GoogleButton clientId={clientId} onCredential={submit} onError={setError} />
        ) : (
          <p className="login-error">구글 로그인 설정이 없어요(VITE_GOOGLE_CLIENT_ID)</p>
        )}
        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
