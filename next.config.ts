import type { NextConfig } from "next";

/**
 * 전 페이지가 빌드 타임에 정적 생성된다 — 동적 세그먼트는 `generateStaticParams`로 전부 열거하고,
 * API Route·서버 액션은 두지 않는다. `output: "export"`를 쓰지 않는 이유는 그 모드가 `next/image`
 * 최적화와 리다이렉트를 막기 때문이다. Vercel에서는 기본 출력도 정적 페이지를 그대로 CDN에서 낸다.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // `/legal`은 문서 하나를 가리키지 않는다 — 기본 문서로 보낸다.
      { source: "/legal", destination: "/legal/terms-of-service", permanent: true },
      { source: "/en/legal", destination: "/en/legal/terms-of-service", permanent: true },
    ];
  },
};

export default nextConfig;
