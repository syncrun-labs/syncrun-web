# SyncRun Web

> 맞대면 그 자리에서 함께 뛰는 러닝 앱 **SyncRun**의 마케팅 사이트.
> [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)의 리퀴드 글래스 감성을
> [React Bits](https://reactbits.dev) 애니메이션 컴포넌트로 웹에 옮겼다.

## 스택

Next.js(App Router) · React 19 · TypeScript · 순수 CSS(디자인 토큰). 애니메이션은
[framer-motion](https://www.framer.com/motion/). 히어로 배경은 스크롤이 프레임을 넘기는 캔버스 시퀀스다.
**전 페이지가 빌드 타임 정적 생성(SSG)이다** — API Route·서버 액션은 없다.
UI 프레임워크는 쓰지 않고, iOS 앱의 토큰을 CSS 변수로 옮겨 손으로 조립했다.

## 디자인 계약 — syncrun-ios에서 가져온 것

색·타이포·글래스 표면은 iOS 앱의 디자인 시스템(`SRColor`·`SRFont`·`Glass.swift`)을 그대로 웹에 옮긴다.

- **팔레트**: 밝은 중립 바탕 + **잉크 검정 `#0B0B0F`**(본문·주 액션) + **시그니처 코랄 `#DC565B`** 단일 액센트. iOS 라이트의 Start 버튼이 검정이듯 주 액션은 검정으로 두어 밝은 화면에 또렷하게 섞는다. 러너 팔레트 8색은 참가자 경로·아바타와 짧은 액센트 바에 쓴다. (`src/index.css`의 `:root`)
- **글래스**: `Glass.swift`의 `srGlass`(ultraThin material + 대각 헤어라인)을 밝은 반투명 흰 표면 + `backdrop-filter` + 대각 스페큘러 하이라이트로 재현 → `.glass`.
- **타이포**: 시스템 폰트 스택 — 라틴은 SF Pro, 한국어는 기기의 한글 서체. 웹폰트를 넣지 않는다. 한글 제목은 자간을 0 근처에 두고(`html:lang(ko)`) 위계는 굵기와 크기로 만든다. 러닝 수치는 항상 `tabular-nums`.
- **모션**: SRMotion spring 감성(`--ease-spring`). 뷰포트 진입 리빌과 `DeviceFrame`의 미세한 스크롤 틸트가 전부다 — 핀 고정·스크롤 스크러빙·스냅 스크롤은 쓰지 않는다.

새 색·폰트를 임의로 추가하지 않는다. iOS 앱의 토큰이 바뀌면 여기 CSS 변수도 함께 맞춘다.

## React Bits 컴포넌트

`src/components/reactbits/` — SyncRun 토큰에 맞춰 손질한 판:
`AnimatedContent`(뷰포트 진입 리빌) · `ClickSpark` · `SafeBoundary`(장식 레이어 에러 바운더리).

장식 레이어(WebGL 등)는 `SafeBoundary`로 감싸 실패해도 페이지 전체가 죽지 않고 CSS 폴백만 남긴다.
`prefers-reduced-motion` 사용자와 `?reveal=all`(정적 QA)에서는 리빌 게이팅을 건너뛰고 콘텐츠를 즉시 보여준다.

## 페이지

라우트는 `app/`에 있고 **언어가 URL을 가른다** — `app/(ko)`가 접두 없는 한국어, `app/en`이 `/en` 아래 영어.

| 주소              | 내용                                                                     | App Store Connect       |
| ----------------- | ------------------------------------------------------------------------ | ----------------------- |
| `/`               | 랜딩 — 제품 소개                                                         | Marketing URL           |
| `/support`        | 지원 — 문의처 · FAQ · 권한 안내 · 계정 삭제 안내                         | Support URL             |
| `/company`        | 회사 소개 — 제품 · 현황 · 기술 · **사업자 정보**                         | —                       |
| `/legal/<슬러그>` | 약관 3종 전문 — `privacy-policy` · `terms-of-service` · `location-terms` | Privacy Policy URL      |

영어판은 같은 구조가 `/en` 아래에 있다(`/en`·`/en/support`가 영어 스토어에 걸린다).
**약관 본문만 번역하지 않는다** — 한국어가 정본이고 앱이 동의를 받는 문서라, 영어 화면에는 그 사실과 요지를 알리는 안내를 띄운다.
`/legal/<슬러그>` 3종은 App Store Connect에 등록된 주소라 바꾸지 않는다(`docs/adr/0001`).

`/company`의 사업자 정보는 약관 3종의 이용약관 제27조·위치기반서비스 이용약관 제16조와 같은 값이어야 한다.
값은 `src/lib/company.ts` 한 곳에 있고 랜딩 푸터도 같은 상수를 읽는다 — 약관을 고칠 때 이 상수를 함께 본다.

지원 페이지의 사실관계(맞댐 조건, 권한 문구, 계정 삭제 경로)는 [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)의
`project.yml` 권한 설명과 앱 화면을 따른다 — 앱이 바뀌면 이 페이지도 같이 고친다.

## 구조

```
app/
  (ko)/                    / · /support · /company · /legal/[slug] — 한국어(접두 없음)
  en/                      같은 구조의 영어판 — /en 아래
  sitemap.ts · robots.ts   색인 장치
src/
  index.css                디자인 토큰(:root) · 리셋 · 글래스 · 버튼 · .section--dark · 키프레임
  App.tsx                  랜딩 섹션 조립(클라이언트 컴포넌트)
  site/                    RootHtml(공유 껍데기) · metadata(제목·canonical·hreflang·og) · config(오리진·경로)
  lib/reveal.ts            리빌 게이팅 스킵 판단(reduced-motion · ?reveal=all)
  lib/company.ts           사업자 정보 상수(약관과 같은 값) — 회사 소개·랜딩 푸터가 함께 읽는다
  components/
    reactbits/             React Bits 계열 컴포넌트 + reactbits.css
    ui/                    DeviceFrame(베젤+실캡처) · HeroScrub(스크롤 구동 프레임 배경) · BumpPair · Facts + ui.css
    sections/              Nav · Hero(스크러빙) · OneStart · Bump · LiveSession · RunCard · Features · CTA · Footer
    LangToggle.tsx         KO/EN 전환 — 상대 언어의 같은 페이지로 가는 링크
  i18n/                    dict.ts(랜딩) · support.ts · company.ts · legal.ts · lang.tsx(LangProvider)
  support/ · company/ · legal/   문서형 페이지 본문. 약관 원문은 legal/docs/*.md(허브 사본)
  styles/                  sections.css(랜딩 레이아웃) · support.css · company.css · legal.css
public/shots/              iOS 시뮬레이터 실캡처 — next/image 정적 import로 쓴다
```

## 개발

```bash
npm install
npm run dev        # 개발 서버
npm run build      # next build — 전 페이지 정적 생성
npm run preview    # 빌드 결과 미리보기(next start)
npm run verify     # lint + format:check + build — 커밋 전 한 방
npm test           # Playwright — 시각 회귀 · 약관 URL 계약
```

## 배포

Vercel이 `main` 병합 시 프로덕션을, 브랜치 푸시 시 프리뷰를 배포한다(GitHub App, 프레임워크 = Next.js).
`.github/workflows/deploy.yml`은 GitHub Pages용 수동 경로다.

## SyncRun

- 제품 SSoT · 요구사항 · 계약: [syncrun](https://github.com/syncrun-labs/syncrun)
- iOS 앱: [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)
- 백엔드: [syncrun-server](https://github.com/syncrun-labs/syncrun-server)

기여 규칙은 [CLAUDE.md](CLAUDE.md)(= [AGENTS.md](AGENTS.md)).
