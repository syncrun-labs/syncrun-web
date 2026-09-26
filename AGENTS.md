# CLAUDE.md — syncrun-web

SyncRun 랜딩페이지. 맞대면 그 자리에서 함께 뛰는 러닝 앱 [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)의
마케팅 사이트다. 랜딩은 **한 번의 러닝**이다 — 저절로 흐르는 워밍업 필름으로 시작해, 모으기 · 3·2·1 · 달리기(이 구간만 가로) · 카드 · 오늘 저녁으로 간다(`docs/adr/0005`).

## 스택

Next.js(App Router) · React 19 · TypeScript · 순수 CSS(디자인 토큰). 랜딩의 움직임은 라이브러리 없이 rAF 한 루프와 CSS 변수로 한다.
**전 페이지가 빌드 타임 정적 생성(SSG)이다** — API Route·서버 액션은 없다.
UI 프레임워크 없음 — iOS 앱의 토큰을 CSS 변수로 옮겨 직접 조립한다.
i18n은 라이브러리 없이 `src/i18n/`의 경량 컨텍스트로 한다(ko/en). 장면 사진은 생성 이미지이고, 사진 속 폰·워치 화면에 앱 UI를 HTML로 얹는다(`public/scenes/`).

## 명령어

```bash
npm install
npm run dev           # 개발 서버
npm run build         # 타입체크 + next build (전 페이지 정적 생성)
npm run preview       # 빌드 결과 미리보기
npm run lint          # ESLint
npm run format        # Prettier 적용 (format:check 는 검사만)
npm run verify        # lint + format:check + build — 커밋 전 한 방
npm test              # Playwright — 시각 회귀 · 약관 URL 계약
npm run lighthouse    # Lighthouse 측정 (LHCI_BASE_URL 로 대상 지정, 기본 프로덕션)
npm run lighthouse:report   # 측정 결과를 표로
```

**변경 후 필수 검증**: `npm run verify`가 통과해야 한다.
husky가 pre-commit에서 `lint`·`format:check`를, pre-push에서 `verify`를 돌린다.

서식은 **Prettier가 전담한다** — 손으로 맞추지 말고 `npm run format`을 돌린다.
`src/legal/docs/`는 포맷 대상이 아니다(허브 사본이라 원문과 바이트로 같아야 한다).

## 필수 규칙

1. **`main`에 직접 푸시하지 않는다.** 작업마다 새 브랜치를 파서 커밋하고, 즉시 `origin`으로 푸시한 뒤
   **PR을 생성해 병합**한다. **병합은 머지 커밋으로 한다(squash·rebase 금지)** — SyncLabs 네 저장소와
   동일하게 이 레포도 GitHub에서 merge commit만 허용한다. **병합하면 그 작업 브랜치를 삭제한다**
   (원격은 `delete_branch_on_merge`로 자동, 로컬은 정리). 로컬에 커밋을 쌓아두지 않는다.
   커밋 메시지는 **Conventional Commits**를 따른다: `type(scope): 한국어 요약`
   (type = feat·fix·docs·refactor·style·chore·test …). **Co-Authored-By에 AI 도구를 넣지 않는다.**
   **이슈·PR 제목도 같은 형식을 쓴다.** 요약은 한국어 평서문("~한다")으로, 마침표 없이.

   | | 형식 | 예 |
   |---|---|---|
   | 커밋 | `type(scope): 요약` | `feat(seo): 로케일별 canonical을 붙인다` |
   | 이슈 | `type(scope): 요약` | `feat(seo): 마케팅 사이트를 Next.js로 이전한다` |
   | PR | `[#이슈] type(scope): 요약` | `[#22] feat(seo): 로케일 구조와 Metadata를 세운다` |

   **이슈 제목에는 번호를 붙이지 않는다** — 생성 전에는 자기 번호를 알 수 없다.
   **PR 제목 앞에는 대상 이슈 번호를 붙인다** — 병합 커밋 제목이 PR 제목이라, 이 접두가
   `git log --first-parent`에 이슈 추적을 남긴다. 대응 이슈가 없는 순수 잡무·메타문서 PR은 접두를 생략한다.
   부연을 덧붙일 때는 괄호가 아니라 `—`나 `·`로 잇는다.

   **이슈 하나에 PR 하나가 기본이다.** PR 본문에 `Closes #N`을 적으면 병합이 이슈를 닫는다 —
   손으로 닫을 일을 만들지 않는 것이 이 기본값의 이유다.
   **예외는 여러 PR로 나뉘는 큰 작업이다.** 이때 이슈는 체크리스트를 가진 우산이 되고,
   각 PR은 `Closes` 대신 **`Refs #N`**으로 건다. GitHub가 닫아주지 않으므로 마지막 PR을 병합한 뒤
   **이슈를 직접 닫는다** — 우산 이슈를 열어둔 채 잊는 것이 이 방식의 유일한 실패 모드다.
   우산이 PR 셋을 넘길 조짐이면 하위 이슈(sub-issue)로 쪼개 각각을 1:1로 되돌린다.
2. **디자인 충실도**: 색·타이포·글래스는 [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)의
   디자인 시스템(`SRColor`·`SRFont`·`Glass.swift`)을 웹으로 옮긴 것이다. 새 색·폰트를 임의로 만들지 말고
   `src/index.css`의 `:root` 토큰(잉크 `#0B0B0F`, **시그니처 코랄 `--accent-core` `#DC565B`**, 러너 팔레트 8색, 글래스 표면)만 쓴다.
   **액센트는 코랄 하나로 통일한다** — 로고의 겹친 두 '맞댐' 원 색이자 iOS `SRColor.accentCore`다.
   (레거시 `--cobalt*` 변수는 코랄로 매핑된 **별칭**일 뿐 — 지원/약관 페이지 호환용. 파란색은 쓰지 않는다.)
   **랜딩은 밤 섹션(사진·검정)이 기본이고 밝은 바탕은 "함께"·카드 두 곳이다** — 러닝 전·후의 밤과 달리는 동안의 낮이다.
   문서형 페이지는 밝은 바탕이 기본이고 검정은 주 액션(iOS 라이트의 Start 버튼)이다. 코랄은 강조·러너 '나'에 쓰고 넓은 채움엔 쓰지 않는다.
   러닝 수치는 항상 `tabular-nums`.
3. **AI 티 나는 장식을 쓰지 않는다.** ① 카드마다 아이콘 하나씩 얹기 ② 점(•)+대문자 모노 eyebrow 라벨
   ③ 문구를 둥근 알약(chip)에 담아 나열하기 — 이 세 패턴은 전부 금지다. 위계는 타이포(큰 숫자·제목)와
   러너 팔레트 컬러 액센트(짧은 바)로 만든다. 아이콘은 의미가 분명한 자리(브랜드 마크, App Store 글리프)에만.
   제품 카피는 사용자 가치로 말한다 — 'SwiftUI·Liquid Glass'·'외부 의존성 0' 같은 개발 자랑 문구는 넣지 않는다.
   글꼴은 시스템 폰트 스택이다(`--font-sans`) — 라틴은 SF Pro, 한국어는 Apple SD Gothic Neo·Noto Sans CJK 등 기기 기본.
   **웹폰트를 넣지 않는다.** Pretendard를 얹으면 랜딩의 LCP 요소가 텍스트라 swap·optional 어느 쪽이든
   첫 페인트가 2~3초 밀린다(로컬·프로덕션 실측). 한국어는 라틴보다 자간을 넉넉히(`:lang(ko)`).
4. **문서·주석은 현재 상태만 서술한다.** 변경 이력·"기존 A에서 B로"·참고 대상 서술은 커밋 메시지가 담당한다.
   주석은 "지금 이 코드가 무엇인지"와 비자명한 "왜"만 적는다.
   **예외는 `docs/adr/`이다** — 아키텍처 결정 기록(ADR)은 결정 시점을 기록한다. 무엇을 정했는지와 함께
   그때의 맥락·검토한 대안·기각 사유를 남긴다. 결정이 뒤집히면 파일을 고치지 말고 새 번호의 ADR을 쓰고
   이전 것을 "대체됨"으로 표시한다. 구조를 바꾸기 전에 관련 ADR의 제약을 먼저 읽는다.
5. **장식은 견고하게.** 달리기 구간의 선 같은 장식 레이어는 실패해도 본문이 죽으면 안 된다 — `SafeBoundary`로 감싼다.
   `prefers-reduced-motion`·`?reveal=all`(`src/lib/reveal.ts`)에서는 **모든 섹션이 완성된 한 장으로 정지한다** —
   필름 대신 포스터, 카운트다운 대신 출발 뒤 모습, 가로 띠 대신 세로로 쌓인 패널. 시각 회귀는 이 상태를 찍는다.
   **활력은 박자와 속도에서 낸다** — 케이던스(분당 180보)에 맞춘 컷·마디, 스크롤 속도(`--speed`)에 반응하는 페이스·속도선.
   장식 입자·파동·링은 쓰지 않는다.
6. **생성 이미지 규칙.** 장면 사진은 생성하되 **얼굴·글자·상표를 넣지 않고, 화면은 꺼진 검정으로** 뽑는다.
   화면 안의 UI는 생성하지 않고 HTML로 얹되, **사진의 화면 모양을 딴 알파 마스크로 잘라** 베젤 밖으로 나가지 않게 하고
   필름 입자를 함께 덮는다(발광 그림자·라이트 모드 UI는 밤 사진에서 떠 보인다). 결과에 가짜 글자(라벨·로고)가 보이면 다시 뽑거나 잘라낸다.
   장소가 특정되는 랜드마크도 쓰지 않는다.

## 구조

- **라우트는 `app/`에 있고 언어가 URL을 가른다** — `app/(ko)`가 `/` · `/support` · `/company` · `/account/delete` · `/legal/[slug]`,
  `app/en`이 같은 구조를 `/en` 아래에. `<html lang>`이 언어마다 달라 루트 레이아웃이 둘이고 껍데기(`src/site/RootHtml.tsx`)를 공유한다.
  **ko에는 접두를 붙이지 않는다** — `/legal/<슬러그>` 3종이 App Store Connect에 등록된 주소다(`docs/adr/0001`).
  `/`는 App Store Connect의 Marketing URL, `/support`는 Support URL. 영어 스토어에는 `/en`·`/en/support`를 건다.
  `/account/delete`는 Google Play Data safety의 계정 삭제 안내 URL이다 — 본문은 플랫폼 이름 없이 앱 내 탈퇴 경로와 이메일 요청 경로만 적는다.
  각 `page.tsx`는 얇다 — `src/site/metadata.ts`의 `buildMetadata()`로 제목·설명·canonical·hreflang(ko/en/x-default)·og를 만들고
  기존 컴포넌트에 `lang`을 넘긴다. `app/sitemap.ts`·`app/robots.ts`가 색인 장치.
  지원 페이지의 사실관계(맞댐 조건·권한 문구·계정 삭제 경로)는 syncrun-ios의 `project.yml`과 앱 화면을 따른다.
  **회사 소개의 사업자 정보는 약관(이용약관 제27조·위치기반서비스 이용약관 제16조)과 같은 값이어야 한다** —
  값은 `src/lib/company.ts` 한 곳에 두고 랜딩 푸터도 그 상수를 읽는다. 약관이 개정되면 이 상수를 함께 본다.
- **약관은 슬러그마다 정적 페이지다.** `src/legal/docs.ts`가 키·슬러그 목록(라우트의 `generateStaticParams`와 화면 탭이 같이 본다),
  `src/legal/read.ts`가 서버에서 원문을 읽어 `Legal`에 넘긴다 — 마크다운은 클라이언트 번들에 들어가지 않는다. `/legal`은 이용약관으로 308.
- **i18n**(`src/i18n/`): **다섯 페이지 전부 ko/en이다.** 언어는 URL이 정하고 라우트가 `LangProvider`에 `lang`과 두 언어의 경로 짝(`paths`)을 넘긴다.
  브라우저 로케일 감지나 저장된 선택은 **없다** — URL 하나에 내용 하나가 고정되어야 검색엔진이 언어판을 구분한다.
  카피는 페이지마다 한 파일이다 — `dict.ts`(랜딩, 구조 `t.<섹션>.<키>`) · `support.ts` · `company.ts` · `account.ts` · `legal.ts`.
  **랜딩 카피만 `useLang().t`로 오고, 문서형 페이지는 `useLang().lang`으로 자기 카피 객체를 고른다** — 한 파일에 다 넣으면 dict가 감당이 안 된다.
  내부 링크는 `useLang().base`(ko `""` · en `"/en"`)를 앞에 붙인다. `components/LangToggle.tsx`는 상대 언어의 같은 페이지로 가는 링크다.
  **약관 본문은 한국어 정본(`*.md`)과 영어 참고본(`*.en.md`) 두 벌이다** — 영어 페이지는 영어본을 낸다(`readLegalDoc(slug, "en")`).
  **한국어가 정본이고 영어는 편의 번역이다** — 앱이 동의를 받는 것은 한국어 문서이며, 그 사실을 문서 머리와 페이지 안내가 함께 밝힌다.
  영어판을 두는 이유는 앱이 영문 이름으로 영문 스토어에 나가 있어서다(GDPR 투명성·CCPA 고지 언어 기준).
- **이미지는 `next/image`에 정적 import로 넘긴다** (`import river from "@/public/scenes/river.jpg"`) — 크기를 빌드가 알고 AVIF/WebP·표시 크기별로 변환된다.
  모바일 랜딩 기준 이미지 합계가 2,100KB에서 100KB가 됐다. `<img>`를 직접 쓰지 않는다(린트가 막는다).
- **랜딩**(`src/components/landing/`): `Landing`이 섹션을 조립하고 한 루프로 스크롤 속도(`--speed`, 문서 루트)와 도크(거리·페이스·시간·장)를 갱신한다.
  섹션마다 움직임의 주인이 다르다 — `Hero`(워밍업, 자동 재생 필름 `public/media/reel.mp4`에 케이던스 마디 · 스크롤하면 작아지며 밀려남) ·
  `Gather`(스크롤로 손이 모이는 프레임 시퀀스 → 원본 사진 + 마스크로 자른 앱 홈) · `Countdown`(화면을 채우면 1초씩 3·2·1, GO에 영상 재생) ·
  `Run`(이 구간만 가로 — 함께 · 터널 · 도착, 네 선과 머리 점, `runGeometry`) · `Card`(떨어지듯 내려앉고 포인터로 기울어지는 카드) · `Closing`.
  `Dock`이 아래 러닝 도크(이 페이지의 유일한 내비게이션), `TopBar`가 이름과 언어.
  **스크롤을 가로채지 않는다** — 고정 구간은 `position: sticky` + 섹션 높이로 만든다(`src/lib/useProgress.ts`의 `--p`, 가로 패널의 `--lp`).
  React는 스크롤마다 다시 렌더하지 않는다. **사진 속 화면 자리(%)와 마스크는 사진을 재서 얻은 것이다** — 사진을 바꾸면 `Gather`의 `SCREENS`·
  `Card`의 `PHONE`·`.watch` 위치와 `public/scenes/*-screen(s).png`를 다시 만든다.
- `src/components/scenes/` — 패널이 쓰는 조각(`RunCardArt`: 앱 단체 카드의 시그니처 배경, `Route`, `crew`: 네 사람·거리·경로 모양).
- `src/index.css` — 디자인 토큰(`:root`, `--accent*` 코랄) · 리셋 · `.glass` · 버튼 · `.section--dark` · 키프레임.
- `src/components/reactbits/SafeBoundary` — 장식 레이어용 에러 바운더리.
- `public/scenes/` — 장면 사진(생성) · 화면 마스크 · **스크롤 구동 영상의 프레임 시퀀스**(`gather`·`tunnel/`, 각 61장 + `manifest.json`,
  `landing/ScrubFrames`가 캔버스에 그린다 · `scripts/scene-frames.sh`로 뽑는다 · `REVERSE=1`은 거꾸로). `public/media/` — 자동 재생 영상(워밍업 필름·출발선·오늘 저녁).
  `public/brand/` — 로고(wordmark·icon).
- `src/support/`·`src/legal/`·`src/company/`·`src/account/` — 지원·약관·회사 소개·계정 삭제 안내 페이지 진입점과 본문. 카피는 `src/i18n/`에 있고 컴포넌트는 렌더만 한다.
  `src/styles/support.css`·`legal.css`·`company.css`·`account.css`가 문서형 레이아웃.
  **`src/legal/docs/*.md`·`*.en.md`는 [syncrun](https://github.com/syncrun-labs/syncrun) 허브 `legal/`의 사본이다** — 허브의 `legal/sync.sh`가 여섯 벌을 맞춘다(앱 번들 사본도 같은 원문을 쓴다). 이 레포에서 약관 본문을 고치지 않는다.
- `src/styles/landing.css` — 랜딩 섹션·도크·위 막대와 반응형·정지 상태. `src/styles/sections.css` — 랜딩 타이포와 푸터.

## 배포

Vercel이 `main` 병합 시 프로덕션, 브랜치 푸시 시 프리뷰를 배포한다(GitHub App). 프리뷰는 배포 보호가 켜져 있어
로그인 없이는 302 — 자동화가 재려면 우회 시크릿이 필요하다. `.github/workflows/deploy.yml`은 GitHub Pages용 수동 경로다.

## SyncRun

제품 SSoT·요구사항·계약은 [syncrun](https://github.com/syncrun-labs/syncrun) 허브. 이 레포는 마케팅 표면이라
FR 요구사항·통신 계약을 담지 않는다 — 제품 메시지가 바뀌면 허브의 현재 사실에 맞춰 카피를 갱신한다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
