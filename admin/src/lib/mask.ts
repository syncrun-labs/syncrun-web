/** `jihoon@gmail.com` → `ji***@gmail.com`. 로컬부가 2자 이하면 전부 가린다. */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at <= 0) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at);
  const shown = local.length <= 2 ? "" : local.slice(0, 2);
  return `${shown}***${domain}`;
}
