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

## 약관 URL 계약

`/legal/terms-of-service` · `/legal/privacy-policy` · `/legal/location-terms` 는
App Store Connect의 개인정보 처리방침 URL이자 **이미 배포된 iOS 앱**이 여는 주소다
(`syncrun-ios`의 `enum LegalLinks`). 앱은 심사와 사용자 업데이트를 거치므로 되돌릴 수 없다.

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
