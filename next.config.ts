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
  // `/admin`은 운영 사이트(syncrun-admin)의 빌드 결과를 `public/admin/`에서 그대로 낸다.
  // 화면 이동은 브라우저 안에서 일어나므로, 파일이 없는 하위 경로는 전부 그 index.html로 돌린다.
  // 공개 파일 확인 뒤에 도는 rewrite라 `/admin/assets/*`는 파일 그대로 나간다.
  async rewrites() {
    return [
      { source: "/admin", destination: "/admin/index.html" },
      { source: "/admin/:path*", destination: "/admin/index.html" },
    ];
  },
  // 운영 사이트는 검색에 잡히지 않는다. robots.txt에 적으면 경로를 알리게 되므로 응답 헤더로 막는다.
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      { source: "/admin", headers: noindex },
      { source: "/admin/:path*", headers: noindex },
    ];
  },
};

export default nextConfig;
