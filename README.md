# SyncRun Web

> 맞대면 그 자리에서 함께 뛰는 러닝 앱 **SyncRun**의 랜딩페이지.
> [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)의 리퀴드 글래스 감성을
> [React Bits](https://reactbits.dev) 애니메이션 컴포넌트로 웹에 옮겼다.

## 스택

Vite · React 18 · TypeScript · 순수 CSS(디자인 토큰). 애니메이션은
[framer-motion](https://www.framer.com/motion/), 오로라 배경은 [ogl](https://github.com/oframe/ogl) WebGL 셰이더.
UI 프레임워크는 쓰지 않고, iOS 앱의 토큰을 CSS 변수로 옮겨 손으로 조립했다.

## 디자인 계약 — syncrun-ios에서 가져온 것

색·타이포·글래스 표면은 iOS 앱의 디자인 시스템(`SRColor`·`SRFont`·`Glass.swift`)을 그대로 웹에 옮긴다.

- **팔레트**: iOS 라이트 모드 기준 — 밝은 바탕(`#EEF0F7`) + **잉크 검정 `#0B0B0F`**(본문·주 액션) + **모션 코발트 시그니처 `#5264E8`**. iOS 라이트의 Start 버튼이 검정이듯 주 액션은 검정으로 두어 밝은 화면에 또렷하게 섞는다. 러너 팔레트 8색은 참가자 경로·아바타와 카드 액센트로 톡 튀게 쓴다. (`src/index.css`의 `:root`)
- **글래스**: `Glass.swift`의 `srGlass`(ultraThin material + 대각 헤어라인)을 밝은 반투명 흰 표면 + `backdrop-filter` + 대각 스페큘러 하이라이트로 재현 → `.glass` / `GlassSurface`.
- **타이포**: Apple 앱이라 SF Pro 시스템 스택이 곧 브랜드. 작은 기술 라벨엔 모노 대비를 얹고, 러닝 수치는 항상 `tabular-nums`.
- **모션**: SRMotion spring 감성(`--ease-spring`). 히어로는 마운트 시, 그 아래는 스크롤 진입 시 리빌.

새 색·폰트를 임의로 추가하지 않는다. iOS 앱의 토큰이 바뀌면 여기 CSS 변수도 함께 맞춘다.

## React Bits 컴포넌트

`src/components/reactbits/` — SyncRun 토큰에 맞춰 손질한 판:
`Aurora`(WebGL 오로라) · `GlassSurface` · `SplitText` · `ShinyText` · `GradientText` ·
`CountUp` · `SpotlightCard` · `StarBorder` · `Magnet` · `ClickSpark` · `AnimatedContent`.

장식 레이어(WebGL 등)는 `SafeBoundary`로 감싸 실패해도 페이지 전체가 죽지 않고 CSS 폴백만 남긴다.
`prefers-reduced-motion` 사용자와 `?reveal=all`(정적 QA)에서는 리빌 게이팅을 건너뛰고 콘텐츠를 즉시 보여준다.

## 페이지

라우터 없이 **독립된 HTML 네 벌**로 빌드한다(`vite.config.ts`의 `rollupOptions.input`).

| 주소 | 내용 | App Store Connect |
| --- | --- | --- |
| `/` | 랜딩 — 제품 소개 | Marketing URL |
| `/support` | 지원 — 문의처 · FAQ · 권한 안내 · 계정 삭제 안내 | Support URL |
| `/company` | 회사 소개 — 제품 · 현황 · 기술 · **사업자 정보** | — |
| `/legal/<슬러그>` | 약관 3종 전문 — `privacy-policy` · `terms-of-service` · `location-terms` | Privacy Policy URL |

**네 페이지 모두 한국어·영어를 갖는다.** 첫 언어는 브라우저 로케일로 정해지고(한국어가 있을 때만 ko, 그 외 en)
KO/EN 토글로 바꾼 선택이 `localStorage`에 남는다. 카피는 페이지마다 `src/i18n/`에 한 파일씩 있다.
**약관 본문만 번역하지 않는다** — 한국어가 정본이고 앱이 동의를 받는 문서라, 영어 화면에는 그 사실과 요지를 알리는 안내를 띄운다.

`/company`의 사업자 정보는 약관 3종의 이용약관 제27조·위치기반서비스 이용약관 제16조와 같은 값이어야 한다.
값은 `src/lib/company.ts` 한 곳에 있고 랜딩 푸터도 같은 상수를 읽는다 — 약관을 고칠 때 이 상수를 함께 본다.

지원 페이지의 사실관계(맞댐 조건, 권한 문구, 계정 삭제 경로)는 [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)의
`project.yml` 권한 설명과 앱 화면을 따른다 — 앱이 바뀌면 이 페이지도 같이 고친다.

## 구조

```
index.html                 랜딩 진입 HTML
support/index.html         지원 페이지 진입 HTML
company/index.html         회사 소개 진입 HTML
src/
  index.css                디자인 토큰(:root) · 리셋 · 글래스 · 버튼 · 키프레임
  main.tsx / App.tsx        진입점 · 섹션 조립
  lib/reveal.ts             리빌 게이팅 스킵 판단(reduced-motion · ?reveal=all)
  components/
    reactbits/              React Bits 계열 컴포넌트 + reactbits.css
    ui/                     제품 목업 — PhoneMock(홈) · RouteArt(러닝 카드) · LiveMap + ui.css
    sections/               Nav · Hero · HowItWorks · OneStart · LiveSession · RunCard · Stats · Features · CTA · Footer
  support/                  지원 페이지 진입점 · 본문(Support.tsx)
  company/                  회사 소개 진입점 · 본문(Company.tsx)
  lib/company.ts            사업자 정보 상수(약관과 같은 값) — 회사 소개·랜딩 푸터가 함께 읽는다
  i18n/                     dict.ts(랜딩) · support.ts · company.ts · legal.ts · lang.tsx(LangProvider)
  components/LangToggle.tsx KO/EN 전환 — 랜딩 Nav와 문서형 페이지가 함께 쓴다
  styles/sections.css       섹션 레이아웃 · 반응형
  styles/support.css        문서형 페이지 레이아웃
  styles/company.css        회사 소개 — 사업자 정보 표 등 문서형 레이아웃 위의 차이만
```

## 개발

```bash
npm install
npm run dev        # 개발 서버
npm run build      # 타입체크 + 프로덕션 빌드 → dist/
npm run preview    # 빌드 결과 미리보기
```

## 배포

정적 사이트라 어느 정적 호스트에도 올라간다. 빌드 산출물은 `dist/`.

- **Vercel / Netlify**: 프레임워크 = Vite, 빌드 = `npm run build`, 출력 = `dist`. `vercel.json` 포함 — `/support` · `/legal` · `/company`는 각자 HTML로, 나머지 경로는 랜딩으로 돌린다.
- **GitHub Pages**: `.github/workflows/deploy.yml`이 준비돼 있다. 레포 **Settings → Pages → Source = "GitHub Actions"**로 켜면 `main` 푸시마다 배포된다. 프로젝트 사이트(`<user>.github.io/syncrun-web/`)라 워크플로가 `VITE_BASE=/syncrun-web/`로 빌드하고, 지원 페이지는 `/syncrun-web/support/`가 된다. 커스텀 도메인·루트 배포는 기본값 `/` 그대로.

## SyncRun

- 제품 SSoT · 요구사항 · 계약: [syncrun](https://github.com/syncrun-labs/syncrun)
- iOS 앱: [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)
- 백엔드: [syncrun-server](https://github.com/syncrun-labs/syncrun-server)

기여 규칙은 [CLAUDE.md](CLAUDE.md)(= [AGENTS.md](AGENTS.md)).
