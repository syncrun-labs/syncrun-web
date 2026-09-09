/**
 * 사업자 정보. 약관 3종(`src/legal/docs/`)의 이용약관 제27조·위치기반서비스 이용약관 제16조가
 * 적고 있는 값과 같아야 한다 — 공개 문서와 회사 소개가 어긋나면 어느 쪽이 사실인지 알 수 없다.
 * 값을 고칠 때는 허브(syncrun)의 `legal/` 원본을 먼저 고쳐 `legal/sync.sh`로 사본을 맞춘 뒤
 * 여기를 바꾼다.
 *
 * 주소는 약관과 같이 도로명까지만 적는다. 사업장이 자택이라 공개 범위를 좁힌 것이고,
 * 방송통신위원회 신고서·사업자등록증에는 전체 주소가 들어간다.
 */
export const COMPANY = {
  ko: {
    name: "싱크런 랩스",
    legalName: "싱크런 랩스(SyncRun Labs)",
    ceo: "이창목",
    ceoLabel: "대표",
    bizNo: "656-09-03142",
    address: "경상북도 경산시 대학로8길 32",
    postalCode: "38659",
    industry: "정보통신업 · 응용 소프트웨어 개발 및 공급업",
    form: "개인사업자",
    founded: "2026년 설립",
  },
  en: {
    name: "SyncRun Labs",
    legalName: "SyncRun Labs (싱크런 랩스)",
    ceo: "Changmok Lee",
    ceoLabel: "Founder & CEO",
    bizNo: "656-09-03142",
    address: "32, Daehak-ro 8-gil, Gyeongsan-si, Gyeongsangbuk-do, Republic of Korea",
    postalCode: "38659",
    industry: "Information & communications · Application software development and supply",
    form: "Sole proprietorship",
    founded: "Founded 2026",
  },
  site: "www.syncrunlabs.com",
  github: "https://github.com/syncrun-labs",
} as const;
