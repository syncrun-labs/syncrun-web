import type { ReactNode } from "react";

/// 번들 마크다운을 블록 단위로 파싱해 렌더한다. 제목·문단·목록·표·인용·구분선과
/// 인라인 강조(**볼드**·*이탤릭*·`코드`·[링크])를 지원한다. 외부 의존성 없음.

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "bullet"; text: string }
  | { kind: "ordered"; marker: string; text: string }
  | { kind: "quote"; text: string }
  | { kind: "hr" }
  | { kind: "table"; rows: string[][]; hasHeader: boolean };

const INLINE = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest.length > 0) {
    const match = INLINE.exec(rest);
    if (!match) {
      nodes.push(rest);
      break;
    }
    if (match.index > 0) nodes.push(rest.slice(0, match.index));
    if (match[2] !== undefined) nodes.push(<strong key={key++}>{match[2]}</strong>);
    else if (match[3] !== undefined) nodes.push(<em key={key++}>{match[3]}</em>);
    else if (match[4] !== undefined) nodes.push(<code key={key++}>{match[4]}</code>);
    else if (match[5] !== undefined)
      nodes.push(
        <a key={key++} href={match[6]} target="_blank" rel="noreferrer">
          {match[5]}
        </a>
      );
    rest = rest.slice(match.index + match[0].length);
  }
  return nodes;
}

function orderedMarker(line: string): string | null {
  const match = /^(\d+)\.\s/.exec(line);
  return match ? `${match[1]}.` : null;
}

function parseCells(row: string): string[] {
  let cells = row.trim();
  if (cells.startsWith("|")) cells = cells.slice(1);
  if (cells.endsWith("|")) cells = cells.slice(0, -1);
  return cells.split("|").map((cell) => cell.trim());
}

function parse(markdown: string): Block[] {
  const blocks: Block[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let index = 0;
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length) {
      blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  while (index < lines.length) {
    const line = lines[index].trim();

    if (line === "") {
      flush();
      index++;
      continue;
    }

    if (line.startsWith("|")) {
      flush();
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index].trim());
        index++;
      }
      const rows = tableLines.map(parseCells);
      let hasHeader = false;
      if (rows.length >= 2 && rows[1].every((cell) => cell.length > 0 && /^[-:]+$/.test(cell))) {
        hasHeader = true;
        rows.splice(1, 1);
      }
      blocks.push({ kind: "table", rows, hasHeader });
      continue;
    }

    if (line === "---" || line === "***" || line === "___") {
      flush();
      blocks.push({ kind: "hr" });
    } else if (line.startsWith("### ")) {
      flush();
      blocks.push({ kind: "heading", level: 3, text: line.slice(4) });
    } else if (line.startsWith("## ")) {
      flush();
      blocks.push({ kind: "heading", level: 2, text: line.slice(3) });
    } else if (line.startsWith("# ")) {
      flush();
      blocks.push({ kind: "heading", level: 1, text: line.slice(2) });
    } else if (line.startsWith("> ") || line === ">") {
      flush();
      blocks.push({ kind: "quote", text: line.replace(/^>+\s?/, "") });
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      flush();
      blocks.push({ kind: "bullet", text: line.slice(2) });
    } else {
      const marker = orderedMarker(line);
      if (marker) {
        flush();
        blocks.push({ kind: "ordered", marker, text: line.slice(marker.length).trim() });
      } else {
        paragraph.push(line);
      }
    }
    index++;
  }

  flush();
  return blocks;
}

export default function Markdown({ source }: { source: string }) {
  const blocks = parse(source);
  return (
    <div className="md">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "heading": {
            const Tag = `h${block.level}` as "h1" | "h2" | "h3";
            return (
              <Tag key={i} className={`md__h md__h${block.level}`}>
                {renderInline(block.text)}
              </Tag>
            );
          }
          case "paragraph":
            return (
              <p key={i} className="md__p">
                {renderInline(block.text)}
              </p>
            );
          case "bullet":
            return (
              <div key={i} className="md__li md__li--bullet">
                <span className="md__li-marker" aria-hidden="true">
                  •
                </span>
                <div className="md__li-body">{renderInline(block.text)}</div>
              </div>
            );
          case "ordered":
            return (
              <div key={i} className="md__li md__li--ordered">
                <span className="md__li-marker mono">{block.marker}</span>
                <div className="md__li-body">{renderInline(block.text)}</div>
              </div>
            );
          case "quote":
            return (
              <blockquote key={i} className="md__quote">
                {renderInline(block.text)}
              </blockquote>
            );
          case "hr":
            return <hr key={i} className="md__hr" />;
          case "table":
            return (
              <div key={i} className="md__table-wrap">
                <table className="md__table">
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) =>
                          block.hasHeader && r === 0 ? (
                            <th key={c}>{renderInline(cell)}</th>
                          ) : (
                            <td key={c}>{renderInline(cell)}</td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
