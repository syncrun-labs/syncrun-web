# CLAUDE.md — syncrun-web

SyncRun 랜딩페이지. 맞대면 그 자리에서 함께 뛰는 러닝 앱 [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)의
리퀴드 글래스 감성을 [React Bits](https://reactbits.dev) 컴포넌트로 웹에 옮긴 마케팅 사이트다.

## 스택

Vite · React 18 · TypeScript · 순수 CSS(디자인 토큰). framer-motion(모션·스크롤 구동 3D 디바이스 회전) · ogl(WebGL 오로라).
UI 프레임워크 없음 — iOS 앱의 토큰을 CSS 변수로 옮겨 직접 조립한다.
i18n은 라이브러리 없이 `src/i18n/`의 경량 컨텍스트로 한다(ko/en). 제품 목업은 iOS 시뮬레이터 **실캡처**를 아이폰 베젤에 담는다(`public/shots/`).

## 명령어

```bash
npm install
npm run dev        # 개발 서버
npm run build      # 타입체크(tsc -b) + vite build → dist/
npm run preview    # 빌드 결과 미리보기
```

**변경 후 필수 검증**: `npm run build`가 타입 오류 없이 통과해야 한다.

## 필수 규칙

1. **`main`에 직접 푸시하지 않는다.** 작업마다 새 브랜치를 파서 커밋하고, 즉시 `origin`으로 푸시한 뒤
   **PR을 생성해 병합**한다. **병합은 머지 커밋으로 한다(squash·rebase 금지)** — SyncLabs 네 저장소와
   동일하게 이 레포도 GitHub에서 merge commit만 허용한다. **병합하면 그 작업 브랜치를 삭제한다**
   (원격은 `delete_branch_on_merge`로 자동, 로컬은 정리). 로컬에 커밋을 쌓아두지 않는다.
   커밋 메시지는 **Conventional Commits**를 따른다: `type(scope): 한국어 요약`
   (type = feat·fix·docs·refactor·style·chore …). **Co-Authored-By에 AI 도구를 넣지 않는다.**
2. **디자인 충실도**: 색·타이포·글래스는 [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)의
   디자인 시스템(`SRColor`·`SRFont`·`Glass.swift`)을 웹으로 옮긴 것이다. 새 색·폰트를 임의로 만들지 말고
   `src/index.css`의 `:root` 토큰(잉크 `#0B0B0F`, **시그니처 코랄 `--accent-core` `#DC565B`**, 러너 팔레트 8색, 글래스 표면)만 쓴다.
   **액센트는 코랄 하나로 통일한다** — 로고의 겹친 두 '맞댐' 원 색이자 iOS `SRColor.accentCore`다.
   (레거시 `--cobalt*` 변수는 코랄로 매핑된 **별칭**일 뿐 — 지원/약관 페이지 호환용. 파란색은 쓰지 않는다.)
   **밝은 바탕이 기본이고 검정은 주 액션(iOS 라이트의 Start 버튼)과 대비 패널로 섞는다.** 다크 시네마틱 섹션은
   `.section--dark`로 토큰을 뒤집는다(맞댐·CTA 두 곳). 코랄은 강조·러너 '나'에 쓰고 넓은 채움엔 쓰지 않는다.
   러닝 수치는 항상 `tabular-nums`.
3. **AI 티 나는 장식을 쓰지 않는다.** ① 카드마다 아이콘 하나씩 얹기 ② 점(•)+대문자 모노 eyebrow 라벨
   ③ 문구를 둥근 알약(chip)에 담아 나열하기 — 이 세 패턴은 전부 금지다. 위계는 타이포(큰 숫자·제목)와
   러너 팔레트 컬러 액센트(짧은 바)로 만든다. 아이콘은 의미가 분명한 자리(브랜드 마크, App Store 글리프)에만.
   제품 카피는 사용자 가치로 말한다 — 'SwiftUI·Liquid Glass'·'외부 의존성 0' 같은 개발 자랑 문구는 넣지 않는다.
   한국어 폰트는 **Pretendard(OFL)**, 라틴은 SF Pro 시스템. 한국어는 라틴보다 자간을 넉넉히(`:lang(ko)`).
4. **문서·주석은 현재 상태만 서술한다.** 변경 이력·"기존 A에서 B로"·참고 대상 서술은 커밋 메시지가 담당한다.
   주석은 "지금 이 코드가 무엇인지"와 비자명한 "왜"만 적는다.
5. **장식은 견고하게.** WebGL·애니메이션 같은 장식 레이어는 실패해도 페이지 본문이 죽으면 안 된다 —
   `SafeBoundary`로 감싸고, `prefers-reduced-motion`에서는 리빌 게이팅을 건너뛰어 콘텐츠를 즉시 보여준다
   (`src/lib/reveal.ts`). `?reveal=all`은 정적 QA용으로 모든 리빌을 즉시 표시한다.

## 구조

- 페이지는 라우터 없이 HTML 세 벌이다(`vite.config.ts`의 `rollupOptions.input`):
  `/`(랜딩 — App Store Connect의 Marketing URL) · `/support`(지원 — Support URL) · `/legal`(약관).
  지원 페이지의 사실관계(맞댐 조건·권한 문구·계정 삭제 경로)는 syncrun-ios의 `project.yml`과 앱 화면을 따른다.
- **i18n**(`src/i18n/`): `dict.ts`(ko/en 카피 — 구조 `t.<섹션>.<키>`) · `lang.tsx`(`LangProvider`/`useLang`).
  첫 언어는 `navigator.languages`로 자동 감지 — **한국어를 하드 기본값으로 두지 않는다**(로케일에 한국어가 있을 때만 ko, 그 외 en).
  선택은 `localStorage('sr-lang')`에 저장되고 Nav의 KO/EN 토글로 바꾼다. 카피 변경은 `dict.ts` 한 곳에서.
- **스냅 스크롤**: `App`이 `html.snap`을 붙이고, 스토리 섹션에 `.snap-chapter`. reduced-motion·모바일에선 미디어쿼리로 끈다.
- `src/index.css` — 디자인 토큰(`:root`, `--accent*` 코랄) · 리셋 · `.glass` · 버튼 · `.section--dark` · 키프레임.
- `src/components/reactbits/` — React Bits 계열(Aurora·SplitText·SpotlightCard·StarBorder·CountUp 등) + `reactbits.css`.
- `src/components/ui/` — 실캡처 목업(`DeviceFrame`: 베젤+스크린샷+스크롤 3D 틸트, `BumpScene`: 두 폰 맞댐+UWB 리플, `BrandMark`) + `ui.css`.
- `src/components/sections/` — 랜딩 섹션(Nav·Hero·OneStart·Bump[다크]·LiveSession·RunCard·Activity·Stats·Features·CTA[다크]·Footer). `App.tsx`가 조립한다.
- `public/shots/` — iOS 시뮬레이터 실캡처(home·activity·card·running·me). `public/brand/` — 로고(wordmark·icon).
  **새 스크린샷은 iPhone 17 Pro 시뮬레이터에서 Release 빌드로 캡처한다**(Debug는 홈에 개발용 칩이 뜬다). 지역은 서울(뚝섬)로 맞춘다.
- `src/support/`·`src/legal/` — 지원·약관 페이지 진입점과 본문(i18n 미적용, 한국어). `src/styles/support.css`·`legal.css`가 문서형 레이아웃.
  **`src/legal/docs/*.md`는 [syncrun](https://github.com/syncrun-labs/syncrun) 허브 `legal/`의 사본이다** — 원문이 개정되면 그대로 복사해 맞춘다(앱 번들 사본도 같은 원문을 쓴다). 이 레포에서 약관 본문을 고치지 않는다.
- `src/styles/sections.css` — 섹션 레이아웃 · 반응형.

## 배포

정적 사이트. `dist/`를 Vercel/Netlify(프레임워크 Vite) 또는 GitHub Pages(`.github/workflows/deploy.yml`,
레포 Settings→Pages→Source=GitHub Actions로 켬)에 올린다. 프로젝트 사이트는 `VITE_BASE=/syncrun-web/`로 빌드한다.

## SyncRun

제품 SSoT·요구사항·계약은 [syncrun](https://github.com/syncrun-labs/syncrun) 허브. 이 레포는 마케팅 표면이라
FR 요구사항·통신 계약을 담지 않는다 — 제품 메시지가 바뀌면 허브의 현재 사실에 맞춰 카피를 갱신한다.
