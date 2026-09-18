/**
 * Lighthouse CI 설정.
 *
 * `LHCI_BASE_URL`로 측정 대상을 바꾼다 — 프로덕션이 기본이고, Vercel 프리뷰 URL이나
 * 로컬 `preview` 서버를 넣을 수 있다. 이전 전후를 같은 척도로 비교하는 것이 목적이라
 * 경로 목록과 에뮬레이션 조건은 고정한다.
 *
 * 패키지가 ESM(`"type": "module"`)이라 이 파일만 `.cjs`다. LHCI에 `--config`로 명시해서 넘긴다.
 */
const BASE_URL = process.env.LHCI_BASE_URL || "https://www.syncrunlabs.com";

/**
 * 공개 페이지 전부. 약관 3종은 `/legal` 한 URL이 아니라 슬러그별로 잰다 —
 * 이전 후에는 문서별 정적 페이지가 되므로, 그 변화를 같은 자리에서 비교해야 한다.
 */
const PATHS = [
  "/",
  "/support",
  "/company",
  "/account/delete",
  "/legal/terms-of-service",
  "/legal/privacy-policy",
  "/legal/location-terms",
];

module.exports = {
  ci: {
    collect: {
      url: PATHS.map((path) => `${BASE_URL}${path}`),
      numberOfRuns: 3,
      settings: {
        // 모바일 기준으로 잰다 — 방문자 대부분이 App Store 링크를 따라오는 모바일이고,
        // 구글의 색인도 모바일 우선이다.
        formFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 3,
          disabled: false,
        },
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./.lighthouseci",
    },
  },
};
