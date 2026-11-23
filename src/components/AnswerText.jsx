// An FAQ answer: blank-line-separated paragraphs, and runs of "- " lines
// become a real bulleted list, one item per line (easier to scan on a phone).
// The trailing spaces keep words apart in the page text crawlers read.
export default function AnswerText({ text, style, gap = 12 }) {
  const blocks = String(text)
    .split(/\n\s*\n/)
    .map((b) => b.split("\n").map((l) => l.trim()).filter(Boolean))
    .filter((b) => b.length);

  return (
    <div style={style}>
      {blocks.map((lines, i) => {
        const mt = i === 0 ? 0 : gap;
        const intro = lines.filter((l) => !l.startsWith("- "));
        const items = lines.filter((l) => l.startsWith("- "));
        if (!items.length)
          return (
            <p key={i} style={{ margin: `${mt}px 0 0`, whiteSpace: "pre-line" }}>
              {lines.join("\n") + " "}
            </p>
          );
        return (
          <div key={i} style={{ marginTop: mt }}>
            {intro.length > 0 && <p style={{ margin: "0 0 6px" }}>{intro.join(" ") + " "}</p>}
            <ul style={{ margin: 0, paddingInlineStart: 22, display: "flex", flexDirection: "column", gap: 4 }}>
              {items.map((l) => (
                <li key={l}>{l.slice(2) + " "}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
