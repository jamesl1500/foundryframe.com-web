/**
 * JsonLd - Foundry Frame
 * ========================
 * Renders schema.org structured data. Escapes "<" so CMS text can't close
 * the script tag early.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <>
      {[data].flat().map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
