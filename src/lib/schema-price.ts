/**
 * Price label parser for structured data - Foundry Frame
 * ==========================================================
 * Converts display strings like "$1,500–$2,500", "$15,000+", and
 * "$99/mo" into a schema.org PriceSpecification, used by the four
 * /packages/* pages to emit Offer structured data.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export function parsePriceSpecification(priceLabel: string) {
  const amounts = Array.from(priceLabel.matchAll(/\$([\d,]+)/g)).map((m) =>
    parseInt(m[1].replace(/,/g, ""), 10)
  );
  const recurring = /\/mo\b/.test(priceLabel);
  const openEnded = priceLabel.includes("+");
  const minPrice = amounts[0];
  const maxPrice = openEnded ? minPrice : (amounts[amounts.length - 1] ?? minPrice);

  return {
    "@type": "PriceSpecification",
    minPrice,
    maxPrice,
    priceCurrency: "USD",
    ...(recurring ? { unitText: "MONTH" } : {}),
  };
}
