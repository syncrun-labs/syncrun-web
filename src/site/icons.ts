import type { Metadata } from "next";
import { SITE_ORIGIN } from "./config";

/** 두 루트 레이아웃이 공유하는 아이콘과 메타데이터 기준 주소. */
export const iconsMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/icon.png" }],
  },
};
