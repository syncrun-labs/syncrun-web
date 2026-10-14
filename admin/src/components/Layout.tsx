import { NavLink, Outlet } from "react-router";
import { useAuth } from "../auth/auth";
import { Logo } from "./Logo";
import { PillButton } from "./PillButton";

/** 로그인 뒤 모든 화면의 틀 — 홈과 같은 배경 위에 유리 상단 막대. */
export function Layout() {
  const { admin, signOut, isMock } = useAuth();
  return (
    <div className="shell">
      <div className="ambient" aria-hidden="true" />
      <header className="topbar glass glass-capsule">
        <NavLink to="/" className="brand">
          <Logo />
          <span>운영</span>
          {isMock && <span className="mock-badge">모의</span>}
        </NavLink>
        <nav className="topnav">
          <NavLink to="/" end>
            홈
          </NavLink>
          <NavLink to="/compose">새 안내</NavLink>
          <NavLink to="/test-recipients">시험 수신자</NavLink>
        </nav>
        <div className="topbar-me">
          <span className="topbar-name">{admin?.name}</span>
          <PillButton variant="quiet" onClick={signOut}>
            로그아웃
          </PillButton>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
