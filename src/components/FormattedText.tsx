/* Renders plain CMS text, turning bullet-style lines into real lists.
   Recognizes "•", "-", "*", "–" and "1." / "1)" line prefixes, plus several
   "•" bullets pasted onto one line. Everything else becomes paragraphs
   (blank lines split paragraphs; single line breaks are kept). */

type Block =
  | { kind: "paragraph"; lines: string[] }
  | { kind: "list"; ordered: boolean; items: string[] };

const UNORDERED = /^\s*[•\-*–·▪◦]\s+(.*)$/;
const ORDERED = /^\s*\d+[.)]\s+(.*)$/;

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];

  const lines = text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    /* "• one • two • three" on a single line becomes three bullet lines. */
    .flatMap((line) =>
      (line.match(/•/g)?.length ?? 0) > 1
        ? line
            .split("•")
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part) => `• ${part}`)
        : [line],
    );

  for (const raw of lines) {
    const line = raw.trim();
    const last = blocks[blocks.length - 1];

    if (!line) {
      blocks.push({ kind: "paragraph", lines: [] }); // paragraph break
      continue;
    }

    const unordered = line.match(UNORDERED);
    const ordered = unordered ? null : line.match(ORDERED);
    const item = unordered?.[1] ?? ordered?.[1];

    if (item !== undefined) {
      const isOrdered = Boolean(ordered);
      if (last?.kind === "list" && last.ordered === isOrdered) {
        last.items.push(item.trim());
      } else {
        blocks.push({ kind: "list", ordered: isOrdered, items: [item.trim()] });
      }
    } else if (last?.kind === "paragraph") {
      last.lines.push(line);
    } else {
      blocks.push({ kind: "paragraph", lines: [line] });
    }
  }

  return blocks.filter((block) =>
    block.kind === "paragraph" ? block.lines.length > 0 : block.items.length > 0,
  );
}

interface FormattedTextProps {
  text: string | null | undefined;
  fallback?: string;
  className?: string;
}

export default function FormattedText({
  text,
  fallback = "",
  className = "",
}: FormattedTextProps) {
  const blocks = parseBlocks(text?.trim() || fallback);

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, index) => {
        if (block.kind === "paragraph") {
          return (
            <p key={index}>
              {block.lines.map((line, lineIndex) => (
                <span key={lineIndex}>
                  {lineIndex > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </p>
          );
        }

        if (block.ordered) {
          return (
            <ol
              key={index}
              className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-accent-ink"
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="pl-1">
                  {item}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <ul key={index} className="space-y-2">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
