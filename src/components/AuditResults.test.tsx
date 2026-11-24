// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AuditResults from "@/components/AuditResults";
import type { AuditRead } from "@/lib/audit/types";

function audit(overrides: Partial<AuditRead> = {}): AuditRead {
  return {
    id: "0b9f7c1e-3c55-4b8e-9f6a-2d1c3b4a5e6f",
    url: "https://acme.example/",
    status: "completed",
    overall_score: 64,
    category_scores: { seo: 70, performance: 43, security: 100, conversion: 0, junk: "n/a" },
    findings: {
      seo: [{ title: "Missing meta description", detail: "Write one." }],
      conversion: [
        { title: "No clear call to action", detail: "Add one." },
        { title: "Phone number isn't clickable", detail: "Use tel:." },
        { title: "No social links", detail: "Link them." },
        { title: "Fourth finding", detail: "Hidden." },
      ],
    },
    ai_summary: "Your site scored 64/100 overall.",
    ai_recommendations: { items: [{ title: "Add a meta description", detail: "It's your Google snippet." }] },
    lighthouse_scores: { performance: 0.4, best_practices: 0.95 },
    lighthouse_metrics: { largest_contentful_paint: { display_value: "3.1 s" } },
    lighthouse_opportunities: [{ title: "Reduce unused JavaScript", description: "Could save about 1.5 s" }],
    lighthouse_error: null,
    error_message: null,
    created_at: "2026-11-24T12:00:00Z",
    updated_at: "2026-11-24T12:01:00Z",
    ...overrides,
  };
}

describe("AuditResults", () => {
  it("shows the overall score and summary", () => {
    render(<AuditResults audit={audit()} />);
    expect(screen.getByText("64")).toBeInTheDocument();
    expect(screen.getByText("Your site scored 64/100 overall.")).toBeInTheDocument();
  });

  it("falls back to a default summary", () => {
    render(<AuditResults audit={audit({ ai_summary: null })} />);
    expect(screen.getByText(/Here's what we found/)).toBeInTheDocument();
  });

  it("lists categories weakest first, skipping non-numeric scores", () => {
    render(<AuditResults audit={audit()} />);
    const breakdown = screen.getByText("Category Breakdown").parentElement!;
    const labels = within(breakdown)
      .getAllByText(/\/100$/)
      .map((node) => node.previousElementSibling?.textContent);
    expect(labels).toEqual(["Conversion", "Performance", "Seo", "Security"]);
    expect(within(breakdown).queryByText("Junk")).not.toBeInTheDocument();
  });

  it("shows at most three findings per category", () => {
    render(<AuditResults audit={audit()} />);
    expect(screen.getByText(/No clear call to action — Add one\./)).toBeInTheDocument();
    expect(screen.queryByText(/Fourth finding/)).not.toBeInTheDocument();
  });

  it("renders the PageSpeed deep-dive", () => {
    render(<AuditResults audit={audit()} />);
    expect(screen.getByText("Performance Deep-Dive (PageSpeed)")).toBeInTheDocument();
    expect(screen.getByText("Best Practices")).toBeInTheDocument();
    expect(screen.getByText("95/100")).toBeInTheDocument();
    expect(screen.getByText("3.1 s")).toBeInTheDocument();
    expect(screen.getByText(/Reduce unused JavaScript — Could save about 1\.5 s/)).toBeInTheDocument();
  });

  it("explains a PageSpeed failure instead of the deep-dive", () => {
    render(<AuditResults audit={audit({ lighthouse_error: "Google PageSpeed couldn't test this page right now." })} />);
    expect(screen.getByText(/Performance deep-dive unavailable/)).toBeInTheDocument();
    expect(screen.queryByText("Performance Deep-Dive (PageSpeed)")).not.toBeInTheDocument();
  });

  it("recommends services for the three weakest categories", () => {
    render(<AuditResults audit={audit()} />);
    const help = screen.getByText("How Foundry Frame Can Help").parentElement!;
    const links = within(help).getAllByRole("link", { name: /Learn More/ });
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/services/advertising",
      "/services/web-design",
      "/services/strategy",
    ]);
  });

  it("renders a sparse audit without crashing", () => {
    render(
      <AuditResults
        audit={audit({
          overall_score: null,
          category_scores: null,
          findings: null,
          ai_recommendations: null,
          lighthouse_scores: null,
          lighthouse_metrics: null,
          lighthouse_opportunities: null,
        })}
      />
    );
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.queryByText("Category Breakdown")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Book A Strategy Call" })).toHaveAttribute("href", "/contact");
  });

  it("renders scanned-site text as plain text, never HTML", () => {
    render(<AuditResults audit={audit({ ai_summary: '<img src=x onerror="alert(1)">' })} />);
    expect(document.querySelector("img")).toBeNull();
    expect(screen.getByText('<img src=x onerror="alert(1)">')).toBeInTheDocument();
  });
});
