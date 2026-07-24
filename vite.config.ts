import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// GitHub Pages(project site)에 올릴 때는 VITE_BASE=/syncrun-web/ 로 빌드한다.
// Vercel·Netlify·커스텀 도메인은 기본값 "/" 그대로 쓴다.
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react()],
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
