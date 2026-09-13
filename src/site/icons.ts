import type { Metadata } from "next";

/** 두 루트 레이아웃이 공유하는 아이콘 선언. 페이지의 metadata와 병합된다. */
export const iconsMetadata: Metadata = {
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/icon.png" }],
  },
};
