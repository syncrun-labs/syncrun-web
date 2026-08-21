/**
 * 문의 창구 주소. 약관 3종(`src/legal/docs/`)이 개인정보 보호책임자·위치정보관리책임자·열람청구
 * 접수처로 적고 있는 주소와 같아야 한다 — 문서가 안내한 곳으로 실제로 메일이 가야 하기 때문이다.
 * 주소를 옮길 때는 허브 원본을 고쳐 `legal/sync.sh`로 사본을 맞춘 뒤 이 상수를 함께 바꾼다.
 */
export const SUPPORT_EMAIL = "support@syncrunlabs.com";

/** 제목을 미리 채운 메일 링크 — 어느 화면에서 왔는지 제목으로 갈린다. */
export function supportMailto(subject: string): string {
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
