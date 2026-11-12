import valueParser from "postcss-value-parser";
import stylelint from "stylelint";

const ruleName = "syncrun/token-colors";
const systemColors =
  /^(accentcolor|accentcolortext|activetext|buttonborder|buttonface|buttontext|canvas|canvastext|field|fieldtext|graytext|highlight|highlighttext|linktext|mark|marktext|selecteditem|selecteditemtext|visitedtext)$/iu;
const mathFunctions = /^(calc|min|max|clamp|round|mod|rem|abs|sign)$/iu;

function argumentsOf(nodes) {
  const args = [[]];
  for (const node of nodes) {
    if (node.type === "div" && node.value === ",") {
      args.push([]);
    } else if (node.type !== "space" && node.type !== "comment") {
      args.at(-1).push(node);
    }
  }
  return args;
}

function isVariable(node) {
  return node.type === "function" && node.value.toLowerCase() === "var";
}

function isMixColor(node) {
  if (node.type === "word") return node.value.toLowerCase() === "transparent";
  if (!isVariable(node)) return false;

  const [name] = argumentsOf(node.nodes);
  return name.length === 1 && name[0].type === "word" && name[0].value.startsWith("--");
}

function isMixWeight(node) {
  if (node.type === "word") return valueParser.unit(node.value)?.unit === "%";
  return isVariable(node) || (node.type === "function" && mathFunctions.test(node.value));
}

function hasTokenColors(nodes) {
  const args = argumentsOf(nodes);
  const first = args[0][0];
  const stops = first?.type === "word" && first.value.toLowerCase() === "in" ? args.slice(1) : args;
  return (
    stops.length > 0 &&
    stops.every((stop) => {
      if (stop.length === 1) return isMixColor(stop[0]);
      return stop.length === 2 && stop.some((node, index) => isMixColor(node) && isMixWeight(stop[1 - index]));
    })
  );
}

export default stylelint.createPlugin(ruleName, (enabled) => (root, result) => {
  if (!stylelint.utils.validateOptions(result, ruleName, { actual: enabled, possible: [true] })) return;

  root.walkDecls((decl) => {
    valueParser(decl.value).walk((node) => {
      if (node.type === "function" && node.value.toLowerCase() === "url") return false;

      const invalidMix =
        node.type === "function" && node.value.toLowerCase() === "color-mix" && !hasTokenColors(node.nodes);
      const systemColor = node.type === "word" && systemColors.test(node.value);
      if (invalidMix || systemColor) {
        stylelint.utils.report({
          ruleName,
          result,
          node: decl,
          message: invalidMix
            ? "color-mix()의 색 인자는 var(--토큰) 또는 transparent를 사용해 주세요."
            : "시스템 색 대신 var(--토큰)을 사용해 주세요.",
        });
      }
    });
  });
});
