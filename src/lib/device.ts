import { useSyncExternalStore } from "react";

export type Device = "ios" | "android" | "desktop";

/** 브라우저에서 한 번 읽고 바뀌지 않는 값을 `useSyncExternalStore`로 읽을 때 쓰는 빈 구독 */
export const noSubscription = () => () => {};

/** 개발 서버에서만: `?device=android`, `?sample` 같은 주소 값으로 화면을 확인한다 */
export function devParam(name: string): string | null {
  if (process.env.NODE_ENV !== "development") return null;
  return new URLSearchParams(window.location.search).get(name);
}

const DEVICES: readonly string[] = ["ios", "android", "desktop"];

/** 페이지를 연 기기. iPadOS는 데스크톱 Safari로 보이므로 터치 지점 수로 가른다. */
function readDevice(): Device {
  const forced = devParam("device");
  if (forced && DEVICES.includes(forced)) return forced as Device;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

/**
 * 페이지를 연 기기. 정적 페이지라 서버에서 그릴 때는 알 수 없어 `serverDevice`로 그리고,
 * 브라우저에서 수화(hydration)한 뒤에 실제 값으로 바꾼다.
 */
export function useDevice(serverDevice: Device): Device {
  return useSyncExternalStore(noSubscription, readDevice, () => serverDevice);
}
