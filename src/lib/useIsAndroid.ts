import { useSyncExternalStore } from "react";

const noSubscription = () => () => {};

/** 개발 서버에서는 `?device=android`로도 확인한다. */
function readIsAndroid(): boolean {
  if (process.env.NODE_ENV === "development" && new URLSearchParams(location.search).get("device") === "android") {
    return true;
  }
  return /Android/.test(navigator.userAgent);
}

/**
 * Android 기기인지. 정적 페이지라 서버에서 그릴 때는 알 수 없어 false로 그리고,
 * 브라우저에서 수화(hydration)한 뒤에 실제 값으로 바꾼다.
 */
export function useIsAndroid(): boolean {
  return useSyncExternalStore(noSubscription, readIsAndroid, () => false);
}
