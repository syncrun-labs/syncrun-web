# 0004. 운영 사이트는 이 레포의 `admin/`에 두고 `/admin`으로 낸다

- 상태: 승인됨
- 날짜: 2026-10-14

## 맥락

운영자가 이용자에게 안내 알림을 보내는 운영 사이트가 필요해졌다(syncrun 허브 FR-OPS-02 · 03 · 04, syncrun-labs/syncrun#502).
처음 설계는 새 저장소 `syncrun-admin`을 만들어 `admin.syncrunlabs.com`에 따로 배포하는 것이었다.
그러려면 저장소 · 배포 프로젝트 · DNS 레코드가 하나씩 늘어난다.

요구는 **추가 배포를 0으로** 하는 것이었다. 이미 있는 것은 두 가지다 — Vercel이 `main`을 배포하는 이 레포와,
`main` 병합이 곧 배포인 syncrun-server.

운영 사이트가 하는 일은 전부 서버 API 호출이다. 이 레포는 API Route를 두지 않고(전 페이지 SSG),
서버의 DB(Cloud SQL)는 사설 IP라 Vercel에서 닿지도 않는다. 그래서 백엔드는 서버에, 화면만 여기에 둔다.

## 결정

1. **소스는 `admin/`이다.** 랜딩과 섞지 않는 독립 Vite + React 앱이다(자기 `package.json` · 잠금 파일 · 테스트).
   Next 페이지로 옮기지 않은 이유: 운영 사이트는 로그인 뒤 브라우저 안에서만 도는 화면이라 SSG·SEO에서 얻을 것이 없고,
   랜딩의 리빌 · 모션 규칙과 섞이면 서로를 제약한다.
2. **결과물은 `public/admin/`에 커밋한다.** `npm run admin:build`가 `/admin/` 기준으로 그 자리에 빌드한다.
   Vercel 빌드는 바뀌지 않는다 — `next build`만 돈다. 빌드 명령에 `admin/` 설치를 끼우면 배포마다 의존성 설치가 하나 늘고,
   그 잠금 파일이 리눅스에서 깨지면 랜딩 배포까지 막힌다.
3. **`/admin` 하위 경로는 `public/admin/index.html`로 돌린다**(`next.config.ts` rewrites). 화면 이동은 브라우저 라우터가 한다.
4. **검색에 잡히지 않게 응답 헤더로 막는다**(`X-Robots-Tag: noindex, nofollow`). robots.txt에 적으면 경로를 알리게 된다.
   랜딩 어디에도 `/admin` 링크를 두지 않는다 — 주소는 팀만 안다. 보안은 서버의 운영자 로그인이 맡는다.
5. **`admin/`은 이 레포의 lint · tsc · Prettier 설정 밖이다**(Prettier 서식만 같이 쓴다). 자기 검사는 `npm run admin:verify`.

## 검토한 대안

- **새 저장소 + `admin.syncrunlabs.com`** — 저장소 · 배포 · DNS가 늘어난다. 기각.
- **Next 라우트(`app/admin`)로 다시 쓰기** — 이 레포에 클라이언트 전용 앱 셸과 상태 라우팅을 들인다. 얻는 것이 없다. 기각.
- **Vercel 빌드에서 `admin/`을 빌드** — 결과물 커밋이 사라지지만 배포 경로에 설치 단계와 실패 지점이 하나 는다. 기각.
  결과물 커밋의 비용은 "소스를 고치면 같은 커밋에 `admin:build` 결과를 싣는다"는 규칙 하나다.
