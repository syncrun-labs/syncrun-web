import LangToggle from "../LangToggle";

/**
 * 위쪽에는 이름과 언어만 둔다. 메뉴는 아래 도크의 장 눈금이 대신한다.
 * 막대 전체가 `mix-blend-mode: difference` 라 밤 사진 위에서는 희고, 밝은 패널 위에서는 검어진다.
 */
export default function TopBar() {
  return (
    <header className="topbar">
      <a href="#top" className="topbar__brand">
        SyncRun
      </a>
      <LangToggle />
    </header>
  );
}
