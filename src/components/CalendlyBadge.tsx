"use client";

import Script from "next/script";

export default function CalendlyBadge() {
  return (
    <>
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      {/* Override Calendly's default bottom-right positioning */}
      <style>{`.calendly-badge-widget { right: auto !important; left: 20px !important; }`}</style>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-expect-error Calendly is injected by the widget script
          window.Calendly?.initBadgeWidget({
            url: "https://calendly.com/jlatten-foundryframe/30min",
            text: "Book a free consultation",
            color: "#C4821A",
            textColor: "#000000",
            branding: false,
          });
        }}
      />
    </>
  );
}
