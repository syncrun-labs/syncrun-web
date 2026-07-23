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

## 구조

```
src/
  index.css                디자인 토큰(:root) · 리셋 · 글래스 · 버튼 · 키프레임
  main.tsx / App.tsx        진입점 · 섹션 조립
  lib/reveal.ts             리빌 게이팅 스킵 판단(reduced-motion · ?reveal=all)
  components/
    reactbits/              React Bits 계열 컴포넌트 + reactbits.css
    ui/                     제품 목업 — PhoneMock(홈) · RouteArt(러닝 카드) · LiveMap + ui.css
    sections/               Nav · Hero · HowItWorks · OneStart · LiveSession · RunCard · Stats · Features · CTA · Footer
  styles/sections.css       섹션 레이아웃 · 반응형
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

- **Vercel / Netlify**: 프레임워크 = Vite, 빌드 = `npm run build`, 출력 = `dist`. `vercel.json` 포함.
- **GitHub Pages**: `.github/workflows/deploy.yml`이 준비돼 있다. 레포 **Settings → Pages → Source = "GitHub Actions"**로 켜면 `main` 푸시마다 배포된다. 프로젝트 사이트(`<user>.github.io/syncrun-web/`)라 워크플로가 `VITE_BASE=/syncrun-web/`로 빌드한다. 커스텀 도메인·루트 배포는 기본값 `/` 그대로.

## SyncRun

- 제품 SSoT · 요구사항 · 계약: [syncrun](https://github.com/syncrun-labs/syncrun)
- iOS 앱: [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)
- 백엔드: [syncrun-server](https://github.com/syncrun-labs/syncrun-server)

기여 규칙은 [CLAUDE.md](CLAUDE.md)(= [AGENTS.md](AGENTS.md)).
