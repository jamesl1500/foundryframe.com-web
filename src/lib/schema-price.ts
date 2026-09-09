/**
 * Price label parser for structured data - Foundry Frame
 * ==========================================================
 * Converts display strings like "Starting at $1,500", "From $99/mo",
 * "$15,000+", and "Custom" into a schema.org PriceSpecification, used
 * by the four /packages/* pages to emit Offer structured data.
 *
 * "Starting at" / "From" / "+" labels are treated as open-ended: we
 * publish a minPrice only, so search engines show an accurate "from"
 * price rather than a hard ceiling we don't want to commit to.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export function parsePriceSpecification(priceLabel: string) {
  const amounts = Array.from(priceLabel.matchAll(/\$([\d,]+)/g)).map((m) =>
    parseInt(m[1].replace(/,/g, ""), 10)
  );

  // No number in the label (e.g. "Custom") — nothing to specify.
  if (amounts.length === 0) {
    return { "@type": "PriceSpecification", priceCurrency: "USD" };
  }

  const recurring = /\/mo\b/i.test(priceLabel);
  const openEnded =
    priceLabel.includes("+") || /\b(starting at|from)\b/i.test(priceLabel);
  const minPrice = Math.min(...amounts);
  const maxPrice = openEnded
    ? undefined
    : Math.max(...amounts);

  return {
    "@type": "PriceSpecification",
    minPrice,
    ...(maxPrice !== undefined ? { maxPrice } : {}),
    priceCurrency: "USD",
    ...(recurring ? { unitText: "MONTH" } : {}),
  };
}
