/**
 * Shared Open Graph / Twitter image template - Foundry Frame
 * ============================================================
 * Single source of truth for the generated social share image, consumed by
 * both src/app/opengraph-image.tsx and src/app/twitter-image.tsx. Mirrors the
 * site's flat, brutalist-minimal aesthetic (black, white, red accent) defined
 * in src/app/globals.css instead of relying on a static portrait photo.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#C4821A";
const ACCENT_GLOW = "#E09A28";
const GRAY = "#999999";

const cornerBracket = (
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
) => {
  const isTop = position.startsWith("top");
  const isLeft = position.endsWith("left");

  return (
    <div
      style={{
        position: "absolute",
        [isTop ? "top" : "bottom"]: 48,
        [isLeft ? "left" : "right"]: 48,
        width: 56,
        height: 56,
        borderTop: isTop ? `4px solid ${ACCENT}` : "none",
        borderBottom: !isTop ? `4px solid ${ACCENT}` : "none",
        borderLeft: isLeft ? `4px solid ${ACCENT}` : "none",
        borderRight: !isLeft ? `4px solid ${ACCENT}` : "none",
        display: "flex",
      }}
    />
  );
};

export function OgImageContent() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#000000",
        fontFamily: "sans-serif",
        position: "relative",
        padding: "80px 96px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          display: "flex",
          background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_GLOW})`,
        }}
      />
      {cornerBracket("top-left")}
      {cornerBracket("top-right")}
      {cornerBracket("bottom-left")}
      {cornerBracket("bottom-right")}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: ACCENT_GLOW,
              marginRight: 18,
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: GRAY,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Foundry Frame
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 32,
          }}
        >
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: -2,
              lineHeight: 1.05,
              textTransform: "uppercase",
            }}
          >
            Creative Design
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: -2,
              lineHeight: 1.05,
              textTransform: "uppercase",
            }}
          >
            Agency
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          paddingTop: 32,
        }}
      >
        <span
          style={{
            fontSize: 22,
            color: GRAY,
            letterSpacing: 1,
          }}
        >
          Branding &middot; Web Design &middot; Marketing &middot; Advertising &middot; Digital Strategy
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: 1,
          }}
        >
          foundryframe.com
        </span>
      </div>
    </div>
  );
}
