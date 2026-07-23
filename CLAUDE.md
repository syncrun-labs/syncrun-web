# CLAUDE.md — syncrun-web

SyncRun 랜딩페이지. 맞대면 그 자리에서 함께 뛰는 러닝 앱 [syncrun-ios](https://github.com/syncrun-labs/syncrun-ios)의
리퀴드 글래스 감성을 [React Bits](https://reactbits.dev) 컴포넌트로 웹에 옮긴 마케팅 사이트다.

## 스택

Vite · React 18 · TypeScript · 순수 CSS(디자인 토큰). framer-motion(모션) · ogl(WebGL 오로라).
UI 프레임워크 없음 — iOS 앱의 토큰을 CSS 변수로 옮겨 직접 조립한다.

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
   `src/index.css`의 `:root` 토큰(잉크 `#0B0B0F`, 모션 코발트 `#5264E8`, 러너 팔레트 8색, 글래스 표면)만 쓴다.
   **밝은 바탕이 기본이고 검정은 주 액션(iOS 라이트의 Start 버튼)과 대비 패널로 섞는다.**
   코발트는 강조·러너 '나'에 쓰고 넓은 채움엔 쓰지 않는다. 러닝 수치는 항상 `tabular-nums`.
3. **장식 아이콘을 남발하지 않는다.** 카드마다 아이콘을 하나씩 얹는 흔한 패턴은 쓰지 않는다 —
   위계는 타이포(큰 숫자·제목)와 러너 팔레트 컬러 액센트로 만든다. 아이콘은 의미가 분명한 자리
   (브랜드 마크, App Store 글리프)에만 쓴다.
4. **문서·주석은 현재 상태만 서술한다.** 변경 이력·"기존 A에서 B로"·참고 대상 서술은 커밋 메시지가 담당한다.
   주석은 "지금 이 코드가 무엇인지"와 비자명한 "왜"만 적는다.
5. **장식은 견고하게.** WebGL·애니메이션 같은 장식 레이어는 실패해도 페이지 본문이 죽으면 안 된다 —
   `SafeBoundary`로 감싸고, `prefers-reduced-motion`에서는 리빌 게이팅을 건너뛰어 콘텐츠를 즉시 보여준다
   (`src/lib/reveal.ts`). `?reveal=all`은 정적 QA용으로 모든 리빌을 즉시 표시한다.

## 구조

- `src/index.css` — 디자인 토큰(`:root`) · 리셋 · `.glass` · 버튼 · 키프레임.
- `src/components/reactbits/` — React Bits 계열(Aurora·SplitText·SpotlightCard·StarBorder·CountUp 등) + `reactbits.css`.
- `src/components/ui/` — 제품 목업(PhoneMock·RouteArt·LiveMap) + `ui.css`.
- `src/components/sections/` — 랜딩 섹션. `App.tsx`가 조립한다.
- `src/styles/sections.css` — 섹션 레이아웃 · 반응형.

## 배포

정적 사이트. `dist/`를 Vercel/Netlify(프레임워크 Vite) 또는 GitHub Pages(`.github/workflows/deploy.yml`,
레포 Settings→Pages→Source=GitHub Actions로 켬)에 올린다. 프로젝트 사이트는 `VITE_BASE=/syncrun-web/`로 빌드한다.

## SyncRun

제품 SSoT·요구사항·계약은 [syncrun](https://github.com/syncrun-labs/syncrun) 허브. 이 레포는 마케팅 표면이라
FR 요구사항·통신 계약을 담지 않는다 — 제품 메시지가 바뀌면 허브의 현재 사실에 맞춰 카피를 갱신한다.
