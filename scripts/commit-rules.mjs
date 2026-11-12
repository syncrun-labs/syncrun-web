export function checkCommit(message, changedFiles) {
  const lines = message.split(/\r?\n/).filter((line) => !line.startsWith("#"));
  const title = lines.find((line) => line.trim()) ?? "";
  const errors = [];

  if (lines.some((line) => /[\u2013\u2014]/u.test(line))) {
    errors.push("커밋 메시지에 em dash 또는 en dash가 있습니다. 가운데점(·), 쉼표, 물결표(~)로 바꿔 주세요.");
  }

  if (changedFiles.some((file) => file.startsWith("src/legal/docs/")) && !title.startsWith("docs(legal)")) {
    errors.push("약관 사본이 변경됐습니다. 제목이 docs(legal)로 시작하는 약관 사본 커밋으로 분리해 주세요.");
  }

  return errors;
}
