import { Component, type ReactNode } from "react";

/**
 * SafeBoundary — 장식용 컴포넌트(WebGL 배경 등)가 실패해도 페이지 전체가 죽지 않게
 * 감싸는 최소 에러 바운더리. 실패 시 조용히 아무것도 렌더하지 않는다.
 */
export default class SafeBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // 의도적으로 조용히 삼킨다 — 장식 레이어라 폴백은 '없음'이 최선.
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
