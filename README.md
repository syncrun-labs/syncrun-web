# SyncRun Web

> 폰을 맞대면 바로 함께 뛰는 러닝 앱 **SyncRun**의 소개 사이트.
> [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)의 디자인 토큰을 웹으로 옮겨, 앱 화면과 실제 러닝 카드로 제품을 설명한다.

## 스택

Next.js(App Router) · React 19 · TypeScript · CSS Modules(디자인 토큰, `docs/adr/0008`).
움직임은 라이브러리 없이 CSS 키프레임과 Web Animations API로 한다.
**공개 페이지는 모두 빌드 타임 정적 생성(SSG)이다.** API Route와 서버 액션은 없다.
예외는 둘이다. 크루 초대 페이지는 껍데기만 정적이고 초대 정보는 브라우저에서 서버 API로 불러온다(CSR).
운영 사이트 `/admin`은 따로 빌드한 Vite SPA를 `public/admin/`에서 그대로 낸다.
UI 프레임워크는 쓰지 않고, iOS 앱의 토큰을 CSS 변수로 옮겨 손으로 조립했다.

## 디자인 계약: syncrun-ios에서 가져온 것

색·타이포·글래스 표면은 iOS 앱의 디자인 시스템(`SRColor`·`SRFont`·`Glass.swift`)을 그대로 웹에 옮긴다.

- **팔레트**: 밝은 중립 바탕 + **잉크 검정 `#0B0B0F`**(본문·주 액션) + **시그니처 코랄 `#DC565B`** 단일 액센트. iOS 라이트의 Start 버튼이 검정이듯 주 액션은 검정으로 두어 밝은 화면에 또렷하게 섞는다. 러너 팔레트 8색은 참가자 경로·아바타와 짧은 액센트 바에 쓴다. (`src/index.css`의 `:root`)
- **글래스**: `Glass.swift`의 `srGlass`(ultraThin material + 대각 헤어라인)을 밝은 반투명 흰 표면 + `backdrop-filter` + 대각 스페큘러 하이라이트로 재현 → `.glass`.
- **타이포**: 시스템 폰트 스택. 라틴은 SF Pro, 한국어는 기기의 한글 서체. 웹폰트를 넣지 않는다(공유 이미지만 빌드 때 Noto Sans KR로 그린다). 한글 제목은 자간을 0 근처에 두고(`html:lang(ko)`) 위계는 굵기와 크기로 만든다. 러닝 수치는 항상 `tabular-nums`.
- **모션**: 스크롤 연출은 없다. 첫 화면의 두 폰이 맞닿는 모션과 질문을 열고 닫는 모션뿐이고, 축소 모션에서는 맞닿은 한 장으로 멈춘다(`docs/adr/0007`).

새 색·폰트를 임의로 추가하지 않는다. iOS 앱의 토큰이 바뀌면 여기 CSS 변수도 함께 맞춘다.

## 페이지

라우트는 `app/`에 있고 **언어가 URL을 가른다.** `app/(ko)`가 접두 없는 한국어, `app/en`이 `/en` 아래 영어.

| 주소              | 내용                                                                     | App Store Connect       |
| ----------------- | ------------------------------------------------------------------------ | ----------------------- |
| `/`               | 랜딩: 제품 소개                                                          | Marketing URL           |
| `/support`        | 지원: 문의처 · FAQ · 권한 안내 · 계정 삭제 안내                          | Support URL             |
| `/company`        | 회사 소개: 제품 · 현황 · 기술 · **사업자 정보**                          |                         |
| `/account/delete` | 계정 삭제 안내: 앱 내 탈퇴 경로 · 지워지는 것 · 이메일 요청              | (Google Play 계정 삭제 URL) |
| `/crew/join/<토큰>` | 크루 초대: 초대 카드 · 기기별 다음 행동(앱에서 열기 · 설치 안내). 검색 제외 |                         |
| `/legal/<슬러그>` | 약관 3종 전문: `privacy-policy` · `terms-of-service` · `location-terms` | Privacy Policy URL      |

영어판은 같은 구조가 `/en` 아래에 있다(`/en`·`/en/support`가 영어 스토어에 걸린다).
**약관 본문만 번역하지 않는다.** 한국어가 정본이고 앱이 동의를 받는 문서라, 영어 화면에는 그 사실과 요지를 알리는 안내를 띄운다.
`/legal/<슬러그>` 3종은 App Store Connect에 등록된 주소라 바꾸지 않는다(`docs/adr/0001`).

`/company`의 사업자 정보는 약관 3종의 이용약관 제27조·위치기반서비스 이용약관 제16조와 같은 값이어야 한다.
값은 `src/lib/company.ts` 한 곳에 있고 랜딩 푸터도 같은 상수를 읽는다. 약관을 고칠 때 이 상수를 함께 본다.
문의 주소(`src/lib/contact.ts`)도 약관이 접수처로 적은 주소와 같아야 한다.

지원 페이지의 사실관계(맞댐 조건, 권한 문구, 계정 삭제 경로)는 [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)의
`project.yml` 권한 설명과 앱 화면을 따른다. 앱이 바뀌면 이 페이지도 같이 고친다.

## 구조

```
app/
  (ko)/                    / · /support · /company · /account/delete · /crew/join · /legal/[slug]: 한국어(접두 없음)
  en/                      같은 구조의 영어판: /en 아래
  sitemap.ts · robots.ts   색인 장치. 페이지마다 opengraph-image.tsx가 빌드 때 공유 이미지를 만든다
src/
  index.css                디자인 토큰(:root: 색·간격·모서리·기기 프레임) · 리셋 · 글래스 · 버튼
  site/                    RootHtml(공유 껍데기) · metadata(제목·canonical·hreflang·og) · config(오리진·경로) · 구조화 데이터 · 공유 이미지 서체
  lib/reveal.ts            축소 모션 · ?reveal=all 판단(첫 화면 모션을 멈춘다)
  lib/device.ts            기기 판정 useDevice(iOS · Android · 데스크톱, 수화 뒤) · 개발용 주소 값
  lib/company.ts           사업자 정보 상수(약관과 같은 값). 회사 소개·랜딩 푸터가 함께 읽는다
  lib/contact.ts           문의 주소(약관의 접수처와 같은 값)
  lib/app-store.ts         App Store 주소. 한국어는 한국 스토어(/kr/), 영어는 국가 코드 없이
  landing/                 랜딩: Landing.tsx(본문과 푸터) · ProductLanding.tsx(메뉴 · 마무리) · 섹션마다 tsx + module.css
                           (Hero · Features · Cards · Reviews · Plans · Faq) · Footer · ui · runners
  ui/                      여러 페이지가 쓰는 조각: Doc.tsx(머리 막대 · 푸터 · 섹션 · 문의 상자)와 doc.module.css, LangToggle.tsx(KO/EN 전환)
  i18n/                    product.ts(랜딩 본문) · dict.ts(메타·푸터) · support.ts · company.ts · account.ts · legal.ts · lang.tsx
  support/ · company/ · account/ · legal/   문서형 페이지 본문. 약관 원문은 legal/docs/*.md(허브 사본)
  crew/                    크루 초대 페이지(클라이언트 컴포넌트, 초대 정보는 브라우저에서 불러온다)
admin/                     운영 사이트 소스(Vite + React, docs/adr/0004). 빌드 결과는 public/admin/에 커밋한다
public/product/            랜딩의 앱 화면 캡처 · 러닝 카드 원본 · App Store QR
```

## 개발

```bash
npm install
npm run dev        # 개발 서버
npm run build      # next build: 전 페이지 정적 생성
npm run preview    # 빌드 결과 미리보기(next start)
npm run verify     # lint + format:check + build: 커밋 전 한 번
npm run typecheck  # 타입 검사(새 체크아웃은 먼저 npx next typegen)
npm run lint:css   # CSS Modules 색 토큰 검사
npm test           # Playwright: 시각 회귀 · 접근성 · 약관 URL 계약 (tests/README.md)
npm run admin:dev     # 운영 사이트 개발 서버(모의 API)
npm run admin:verify  # 운영 사이트 lint + test + public/admin/ 빌드
```

## 배포

Vercel이 `main` 병합 시 프로덕션을, 브랜치 푸시 시 프리뷰를 배포한다(GitHub App, 프레임워크는 Next.js).
Vercel은 `admin/`을 빌드하지 않는다. 커밋된 `public/admin/`을 그대로 낸다.
PR마다 `pr-check` 워크플로가 대시와 커밋 규칙, lint · CSS 토큰 · 서식 · 타입, 약관 URL과 접근성 테스트를 본다(문서만 바뀐 PR은 대시와 커밋만).
Lighthouse 측정은 `lighthouse` 워크플로를 손으로 돌린다.

## SyncRun

- 제품 SSoT · 요구사항 · 계약: [syncrun](https://github.com/syncrun-labs/syncrun)
- iOS 앱: [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)
- Android 앱: [syncrun-android](https://github.com/syncrun-labs/syncrun-android)
- 백엔드: [syncrun-server](https://github.com/syncrun-labs/syncrun-server)

기여 규칙은 [AGENTS.md](AGENTS.md).
