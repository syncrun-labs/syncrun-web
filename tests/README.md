# tests

Playwright로 두 가지를 지킨다.

| 파일 | 무엇 |
|---|---|
| `legal-urls.spec.ts` | **약관 URL 계약** — 세 주소가 각각 제 문서를 200으로 낸다 |
| `visual.spec.ts` | **시각 회귀** — 6개 페이지 × 데스크톱·모바일 × ko·en 풀페이지 비교 |

```bash
npm test              # 검증
npm run test:update   # 기준 이미지 생성·갱신
npm run test:report   # 실패 diff 보기
```

`E2E_BASE_URL`을 주면 로컬 서버 대신 그 주소를 겨눈다. 배포본이 실제로 무엇을 서빙하는지
확인하는 용도라, 계약 테스트와 함께 쓴다.

```bash
E2E_BASE_URL=https://www.syncrunlabs.com npx playwright test legal-urls
E2E_BASE_URL=<Vercel 프리뷰 URL> npx playwright test legal-urls   # 병합 전 확인
```

시각 회귀는 이 방식으로 돌리지 않는다 — 기준 이미지는 로컬 빌드에서 뜬 것이라 배포본과 맞지 않는다.

## 약관 URL 계약

`/legal/terms-of-service` · `/legal/privacy-policy` · `/legal/location-terms` 는
App Store Connect에 등록돼 심사에서 열리는 주소이고, `syncrun-ios`가 정식 주소로 선언해 둔 값이다
(`enum LegalLinks`). 앱 자체는 번들된 마크다운을 렌더하므로 이 주소를 열지는 않는다.

라우팅·로케일 구조를 바꾸기 전에 [ADR 0001](../docs/adr/0001-migrate-to-nextjs.md)의 제약을 먼저 읽는다.

## 렌더가 결정론적인 이유

`playwright.config.ts`의 `reducedMotion: "reduce"` 하나가 흔들리는 요소를 전부 고정한다.

- 리빌 게이팅(`src/lib/reveal.ts`)이 즉시 최종 상태로 건너뛴다
- `Aurora`는 WebGL 루프 대신 `uTime` 고정 프레임만 그린다
- 스냅 스크롤이 꺼져 풀페이지 캡처가 온전히 잡힌다

언어는 `locale`이 정한다 — `detectLang()`이 `navigator.languages`를 읽고, 새 컨텍스트에는
`localStorage('sr-lang')`가 없어 로케일이 그대로 첫 언어가 된다.

캡처 전에 페이지 끝까지 훑는다. `loading="lazy"` 이미지는 뷰포트에 들어와야 로드되는데
풀페이지 캡처는 뷰포트 밖도 찍기 때문이다.

## 기준 이미지를 커밋하지 않는 이유

24장이 약 41MB다. 약관 문서가 길어 풀페이지 캡처가 장당 2MB에 이른다. git 히스토리는 영구적이라
이만한 용량을 넣으면 되돌릴 수 없고, 손실 압축으로 줄이면 양자화 노이즈가 가짜 diff를 만든다.

그래서 `.gitignore`에 두고 각자 로컬에서 만든다. 포팅처럼 "외형이 바뀌지 않았음"을 확인해야 하는
작업은 이 순서로 한다.

```bash
git switch main && npm run test:update   # 기준 뜨기
git switch <작업 브랜치> && npm test      # 비교
```

기준 이미지는 그 작업 동안만 유효하다 — 디자인이 의도적으로 바뀌면 `npm run test:update`로 다시 뜬다.
