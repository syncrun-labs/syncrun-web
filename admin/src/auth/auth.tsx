import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import type { ApiClient } from "../api/client";
import { HttpApiClient } from "../api/http-client";
import { MockApiClient } from "../api/mock-client";
import type { AdminDTO } from "../api/types";

interface Session {
  token: string;
  expiresAt: number;
  admin: AdminDTO;
}

interface AuthValue {
  api: ApiClient;
  admin: AdminDTO | null;
  isMock: boolean;
  signIn: (idToken: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export const isMockMode = import.meta.env.VITE_API_MOCK === "1";

/**
 * 운영자 세션과 API 클라이언트. 토큰은 메모리에만 둔다 — 새로고침하면 다시 로그인한다.
 * 만료되거나 서버가 401을 주면 세션을 버린다(RequireAuth가 로그인으로 보낸다).
 */
export function AuthProvider({ children, api: injected }: { children: ReactNode; api?: ApiClient }) {
  const [session, setSession] = useState<Session | null>(null);
  const tokenRef = useRef<string | null>(null);

  const signOut = useCallback(() => {
    tokenRef.current = null;
    setSession(null);
  }, []);

  const api = useMemo<ApiClient>(() => {
    if (injected) return injected;
    if (isMockMode) return new MockApiClient();
    return new HttpApiClient({
      baseUrl: import.meta.env.VITE_API_BASE_URL ?? "https://staging-api.syncrunlabs.com/api/v1",
      getToken: () => tokenRef.current,
      onUnauthorized: signOut,
    });
  }, [injected, signOut]);

  const signIn = useCallback(
    async (idToken: string) => {
      const result = await api.login(idToken);
      tokenRef.current = result.token;
      setSession({
        token: result.token,
        expiresAt: Date.parse(result.expiresAt),
        admin: result.admin,
      });
    },
    [api],
  );

  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(signOut, Math.max(0, session.expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [session, signOut]);

  const value = useMemo<AuthValue>(
    () => ({ api, admin: session?.admin ?? null, isMock: isMockMode, signIn, signOut }),
    [api, session, signIn, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

export function useApi(): ApiClient {
  return useAuth().api;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { admin } = useAuth();
  const location = useLocation();
  if (!admin) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}
