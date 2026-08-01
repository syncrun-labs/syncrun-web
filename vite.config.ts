import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

// 약관 문서별 공개 URL(`/legal/<슬러그>`)은 App Store Connect의 개인정보 URL과 앱의 약관 링크가 가리키는 주소다.
// 약관 페이지 HTML을 슬러그마다 복제해 실제 파일로 둔다 — 정적 파일이라 호스트의 리라이트 규칙에 기대지 않고,
// 문서 선택은 `Legal.tsx`가 경로에서 읽는다.
const LEGAL_SLUGS = ["privacy-policy", "terms-of-service", "location-terms"];

function legalDocumentRoutes(): Plugin {
  return {
    name: "syncrun-legal-document-routes",
    apply: "build",
    closeBundle() {
      const source = resolve(__dirname, "dist/legal/index.html");
      for (const slug of LEGAL_SLUGS) {
        copyFileSync(source, resolve(__dirname, `dist/legal/${slug}.html`));
      }
    },
  };
}

// GitHub Pages(project site)에 올릴 때는 VITE_BASE=/syncrun-web/ 로 빌드한다.
// Vercel·Netlify·커스텀 도메인은 기본값 "/" 그대로 쓴다.
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), legalDocumentRoutes()],
  build: {
    // 랜딩(/)과 지원 페이지(/support)는 각각 독립된 HTML로 빌드된다 —
    // App Store Connect에 적는 Support URL은 라우터 없이도 열리는 실제 주소여야 한다.
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        support: resolve(__dirname, "support/index.html"),
        legal: resolve(__dirname, "legal/index.html"),
      },
    },
  },
});
