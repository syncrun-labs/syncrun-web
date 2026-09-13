# 0001. 마케팅 사이트를 Next.js로 이전한다

- 상태: 승인됨
- 날짜: 2026-09-10

## 맥락

syncrun-web은 Vite · React 18 · TypeScript로 만든 정적 마케팅 사이트다. 페이지는 라우터 없이 HTML 네 벌
(`/` · `/support` · `/legal` · `/company`)이고, API 호출·폼 제출·시크릿이 없다. 문의는 `mailto:` 링크이고
데이터는 소스의 카피와 `public/`의 이미지가 전부다. **서버가 필요한 지점이 없다.**

영어권을 제품의 두 번째 시장으로 잡으면서, 이 사이트가 검색에서 발견되어야 하는 표면이 되었다.
현재 구조에는 그걸 가로막는 세 가지가 있다.

**1. 언어 전환이 클라이언트 전용이다.** `src/i18n/lang.tsx`가 `useEffect`로 `<html lang>`·제목·설명을
바꾼다. 초기 HTML은 네 페이지 모두 한국어이고, 로케일별 URL도 상호 `hreflang`도 없다. 검색엔진에는
사실상 한국어 페이지 하나로만 존재한다.

**2. 약관 3종이 URL 하나로 보인다.** `/legal/terms-of-service`·`/legal/privacy-policy`·`/legal/location-terms`가
전부 같은 HTML과 같은 `<title>`을 반환하고, 어느 문서를 그릴지는 `src/legal/Legal.tsx`의 `keyFromLocation()`이
브라우저에서 `pathname`을 읽어 정한다. 세 문서가 검색엔진에는 중복 콘텐츠 한 건이다.

**3. 색인 유도 장치가 없다.** `robots.txt`·`sitemap.xml`·`canonical`·`og:image`가 전부 빠져 있다.
`twitter:card`는 `summary_large_image`로 선언되어 있는데 이미지가 없어 공유 카드가 깨진다.

여기에 성능 문제가 겹친다. 제품 스크린샷이 최적화되지 않은 PNG 약 2MB(`activity.png` 859K,
`home.png` 603K, `card.png` 324K)이고, Pretendard를 jsdelivr CDN에서 렌더 블로킹으로 불러온다.
Core Web Vitals는 검색 랭킹 요소다.

## 결정

**Next.js App Router로 이전하고, 전 페이지를 빌드 타임에 정적 생성(SSG)한다.**

서버 렌더링을 런타임에 하려는 것이 아니다. API Route도 서버 액션도 두지 않는다.
산출물은 지금과 같은 정적 파일이고, 배포도 Vercel 그대로다.

## 근거

**결정 축은 다국어 SEO다.** 영어 시장을 진지하게 하려면 로케일별 URL에 상호 `hreflang`과
로케일별 `canonical`이 정확히 걸려야 검색엔진이 중복이 아닌 언어판으로 인식한다.
Vite에서 하면 로케일 라우트 생성, 메타 태그 주입, 빌드 스크립트를 전부 직접 짜고 유지해야 한다.
App Router는 `app/[locale]` 세그먼트 + `generateStaticParams` + Metadata API의 `alternates`로
이 배관을 프레임워크가 처리한다. 손으로 관리할 때 생기는 버그 종류가 통째로 사라진다.

부수적으로 따라오는 것들:

| 항목 | 현재 | 이전 후 |
|---|---|---|
| 약관 3종 | `/legal` 한 URL에서 클라이언트 탭 전환 | `app/[locale]/legal/[slug]`로 문서별 정적 페이지 3개 — 개별 인덱싱·개별 canonical |
| 스크린샷 | 무최적화 PNG 약 2MB | `next/image`가 AVIF/WebP·사이즈별 자동 변환 |
| Pretendard | jsdelivr CDN 렌더 블로킹 | `next/font/local` self-host — 자동 preload, 서드파티 왕복 제거, CLS 제거 |
| 약관 원문 | `?raw`로 클라이언트 번들에 포함 | 서버 컴포넌트에서 읽어 번들에서 제외 |
| sitemap·robots | 없음 | `app/sitemap.ts`·`app/robots.ts` |

**시점도 근거의 일부다.** 지금 페이지가 넷이다. 영어판을 만들고 콘텐츠를 늘린 뒤에 옮기면 훨씬 비싸진다.

## 검토한 대안

**A. Vite 유지 + 프리렌더 도입** (`vite-react-ssg` 등)
정적 HTML 산출과 SEO 갭 해소까지는 이걸로 된다. 기각한 이유는 다국어다. 로케일 라우트와 `hreflang`을
직접 구성하고 계속 관리해야 하는데, 이게 앞으로 이 사이트에서 가장 자주 건드릴 부분이다.
한국어 단일 언어로 남을 계획이었다면 이 선택이 맞다.

**B. 현상 유지 + 메타 갭만 메우기**
`robots.txt`·`sitemap.xml`·`canonical`·`og:image`만 추가하는 안. 반나절이면 되지만 근본 문제인
"콘텐츠가 클라이언트에서만 완성된다"와 로케일 URL 부재를 그대로 둔다. 영어 시장 진입에는 미달이다.

## 제약 — 앱 밖에서 참조하는 약관 URL

**다음 세 주소를 유지한다.** App Store Connect의 개인정보 처리방침 URL이자,
`syncrun-ios`가 정식 주소로 선언해 둔 값이다 (`LegalDocumentView.swift`의 `enum LegalLinks`).

```
https://www.syncrunlabs.com/legal/terms-of-service
https://www.syncrunlabs.com/legal/privacy-policy
https://www.syncrunlabs.com/legal/location-terms
```

앱 자체는 이 주소를 열지 않는다 — 약관 화면은 번들된 마크다운을 네이티브로 렌더한다
(`LegalMarkdownView(source: .bundle(...))`). 따라서 앱 바이너리가 이 경로를 붙잡고 있지는 않다.
그럼에도 유지하는 이유는 App Store Connect에 등록돼 심사에서 열리는 주소이고, 외부 링크와
검색 색인이 걸려 있으며, 바꿀 이유가 없기 때문이다.

**기본 언어(ko)에는 로케일 프리픽스를 붙이지 않는다** (`localePrefix: 'as-needed'`).
위 경로는 문자 그대로 유지되고, 영어판만 `/en/legal/<슬러그>`로 추가된다.
이는 제약이 없더라도 기본 언어에 관해 널리 쓰이는 관례와 같다.

리다이렉트로 우회하지 않는다 — 앱스토어 심사 URL이 리다이렉트를 타는 상황을 만들지 않기 위해서다.

이전 PR에는 위 세 주소가 각각 올바른 문서를 200으로 반환하는지 확인하는 스모크 테스트를 포함한다.

## 결과

**받아들이는 것**

- 프레임워크 표면적이 커진다. 서버 컴포넌트 경계, App Router 규약 같은 개념을 익혀야 한다.
  사이트 규모가 작아 비용은 제한적이라고 본다.
- `src/legal/docs/*.md`를 읽는 방식이 바뀐다. `?raw`는 Vite 전용 문법이라 서버 컴포넌트의
  파일 읽기로 대체한다. 허브 `legal/sync.sh`가 사본을 넣는 경로가 바뀌면 그 스크립트도 함께 고친다.
- `ogl` WebGL 배경(`Aurora`)은 CTA 섹션 한 곳에만 쓰인다. `'use client'` + dynamic import로 격리한다.

**바뀌지 않는 것**

- 서버 없는 정적 사이트라는 성격. 배포 대상도 Vercel 그대로다.
- 디자인 토큰과 컴포넌트. 색·타이포·글래스는 `syncrun-ios`에서 옮겨온 것이고 그대로 간다.
- 약관 본문. 한국어가 정본이며 번역하지 않는다는 원칙은 유지된다.

## 후속 작업

1. **충실 포팅** — 현재 디자인 그대로, 외형 변경 없이 Next로 옮긴다.
   로케일 구조 · Metadata · sitemap · robots · 약관 슬러그 라우트 · 스모크 테스트를 포함한다.
2. **전면 리디자인** — 별건으로 진행한다. 1을 먼저 하는 이유는 리디자인을 두 번 하지 않기 위해서다.

포팅 전에 현재 화면의 스크린샷 베이스라인을 떠 둔다. 지금 레포에는 lint도 test도 없어
"외형 변경 없음"을 검증할 수단이 없다.
