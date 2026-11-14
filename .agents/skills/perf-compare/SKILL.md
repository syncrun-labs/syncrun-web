---
name: perf-compare
description: syncrun-web의 렌더링, 서버·클라이언트 컴포넌트 경계, 번들 또는 첫 화면 로딩 변경을 전후 비교할 때 사용한다. 프로덕션 빌드의 페이지별 JS·HTML 크기와 모바일 Lighthouse LCP·TBT를 비교해 PR 검증에 남긴다.
---

# 웹 성능 전후 비교

1. PR의 기준 커밋과 변경 커밋을 각각 빌드하고 SHA를 기록한다. 각 워크트리에서 잠금 파일대로 `npm ci`를 실행하고 `npm run build`로 프로덕션 결과물을 만든다. 같은 Node·Chrome 버전과 Lighthouse 설정을 사용한다.
2. 변경 쪽 워크트리에서 같은 스크립트로 양쪽 빌드의 크기를 잰다. 경로를 생략하면 한국어·영어 공개 페이지를 잰다.

   ```sh
   node scripts/web-js-size.mjs "$before_worktree" / /en
   node scripts/web-js-size.mjs "$after_worktree" / /en
   ```

   HTML이 `script src`로 직접 불러오는 Next.js 파일을 페이지마다 중복 없이 센다. 인라인 데이터는 HTML 크기에 포함된다. 파일별 gzip 합계는 빌드 산출물 비교값이다. 브라우저의 실제 전송량은 Lighthouse 네트워크 결과에서 확인한다.

3. 두 빌드에서 각각 `npm run preview`로 프로덕션 서버를 실행한다. 한쪽 측정을 마치고 서버를 종료한 뒤 다음 빌드를 같은 포트에서 잰다. 아래 명령은 변경 쪽 워크트리에서 양쪽에 공통으로 사용한다.

   ```sh
   LHCI_BASE_URL=http://localhost:4173 npm run lighthouse
   npm run lighthouse:report
   ```

   실행 전에 기존 `.lighthouseci/` 리포트는 별도 경로에 보관한다. 각 실행이 끝나면 그 결과를 기준·변경 SHA별로 보관한다. 기본 설정은 한국어 공개 경로를 모바일에서 URL당 3회 측정한다. 영어·크루 초대 등 추가 경로가 필요하면 두 실행에 같은 전체 URL 목록을 `--url`로 넘긴다. 경로마다 정상 페이지의 유효한 결과 3개와 LCP·TBT가 있는지 확인하고 각 지표의 중앙값을 사용한다.

4. PR의 **검증** 항목에 기준·변경 SHA, 측정 환경, 영향을 받는 경로별 전후값을 적는다. JS가 줄어도 HTML이 늘 수 있으므로 gzip 크기 두 항목과 합계 차이를 함께 본다. 로딩 지표가 실행마다 크게 흔들리면 범위를 함께 적는다. 측정할 수 없었던 항목은 사유를 남긴다.

   | 페이지 | JS gzip (KiB) | HTML gzip (KiB) | 합계 차이 (KiB) | LCP | TBT |
   |---|---|---|---|---|---|
   | `/경로` | 전 → 후 | 전 → 후 | 후 − 전 | 전 → 후 | 전 → 후 |
