import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages(project site)에 올릴 때는 VITE_BASE=/syncrun-web/ 로 빌드한다.
// Vercel·Netlify·커스텀 도메인은 기본값 "/" 그대로 쓴다.
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react()],
});
