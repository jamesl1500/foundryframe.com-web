import { describe, expect, it } from "vitest";
import { photoForIndustry, photoForService, photos, unsplashUrl } from "@/lib/media/unsplash";
import { industries } from "@/lib/seo/industries";

describe("unsplashUrl", () => {
  it("asks the CDN for a cropped, auto-format image at the width", () => {
    expect(unsplashUrl("photo-123", 800)).toBe("https://images.unsplash.com/photo-123?auto=format&fit=crop&w=800&q=75");
    expect(unsplashUrl("photo-123", 400, 60)).toContain("&q=60");
  });
});

describe("photo pickers", () => {
  it("maps services by keyword", () => {
    expect(photoForService("branding")).toBe("swatches");
    expect(photoForService("x", "Social Media")).toBe("socialIcons");
    expect(photoForService("advertising")).toBe("posters");
    expect(photoForService("web-design")).toBe("designDesk");
  });

  it("returns a real photo for every industry", () => {
    for (const { slug } of industries) expect(photos[photoForIndustry(slug)], slug).toBeDefined();
  });

  it("gives every photo alt text and credit", () => {
    for (const [key, photo] of Object.entries(photos)) {
      expect(photo.alt?.trim().length, key).toBeGreaterThan(5);
    }
  });
});
