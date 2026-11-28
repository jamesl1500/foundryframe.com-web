/**
 * How We Work - Foundry Frame
 * =============================
 * The no-meetings process as a four-step strip: proposal, deposit, build
 * with written updates, approve and launch. Below it, the three things that
 * make it work: the Binx client portal, recorded walkthroughs instead of
 * calls, and an optional short call for anyone who'd rather talk.
 * Steps and links come from lib/site-facts.ts.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import { BOOKING_URL } from "@/lib/analytics";
import {
  CLIENT_PORTAL,
  HOW_WE_WORK_STEPS,
  OPTIONAL_CALL_LABEL,
  OPTIONAL_CALL_MINUTES,
  PROPOSAL_CTA_LABEL,
  PROPOSAL_HREF,
} from "@/lib/site-facts";

type HowWeWorkProps = {
  /** Where "Request a proposal" points; an on-page anchor where the form is on the same page. */
  proposalHref?: string;
  /** Analytics label prefix for the section's links. */
  trackLabel?: string;
};

export default function HowWeWork({ proposalHref = PROPOSAL_HREF, trackLabel = "How we work" }: HowWeWorkProps) {
  const notes = [
    {
      title: "One place to follow progress",
      body: (
        <>
          Every milestone, file, and approval lives in your{" "}
          <a
            href={CLIENT_PORTAL.url}
            target="_blank"
            rel="noopener noreferrer"
            data-track={`${trackLabel}: ${CLIENT_PORTAL.name}`}
            className="font-semibold text-ink underline underline-offset-4 decoration-molten decoration-2 hover:text-molten-deep"
          >
            {CLIENT_PORTAL.name}
          </a>{" "}
          client portal. It&apos;s our own product, so you&apos;re using it the way we built it to be used.
        </>
      ),
    },
    {
      title: "Recordings instead of calls",
      body: "Design reviews and updates come as short screen recordings. Watch them on your schedule and reply in writing.",
    },
    {
      title: "Prefer to talk? That's fine.",
      body: (
        <>
          An optional {OPTIONAL_CALL_MINUTES}-minute call is there whenever you want one.{" "}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-track={`${trackLabel}: optional call`}
            className="font-semibold text-ink underline underline-offset-4 decoration-molten decoration-2 hover:text-molten-deep"
          >
            {OPTIONAL_CALL_LABEL}
          </a>
          .
        </>
      ),
    },
  ];

  return (
    <section id="how-we-work" aria-labelledby="how-we-work-heading" className="py-16 lg:py-24 scroll-mt-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <FadeIn className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow">How we work</span>
            <h2
              id="how-we-work-heading"
              className="mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-[-0.035em] leading-[0.95] text-ink"
            >
              No meetings.{" "}
              <em className="serif-accent text-molten-deep">Just progress you can see.</em>
            </h2>
          </div>
          <p className="max-w-sm text-body leading-relaxed">
            You&apos;re busy running a business. Every project runs in writing,
            from the first proposal to launch day, so you never have to block
            out an afternoon for a status call.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
        <ol
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-[1.5px] border-ink rounded-card overflow-hidden bg-paper"
        >
          {HOW_WE_WORK_STEPS.map((step, i) => (
            <li
              key={step.step}
              className={`relative p-6 lg:p-8 border-ink ${i > 0 ? "border-t-[1.5px] sm:border-t-0" : ""} ${
                i % 2 === 1 ? "sm:border-l-[1.5px]" : ""
              } ${i >= 2 ? "sm:border-t-[1.5px] lg:border-t-0" : ""} ${i === 2 ? "lg:border-l-[1.5px]" : ""}`}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-molten font-mono text-xs font-semibold text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < HOW_WE_WORK_STEPS.length - 1 && (
                  <span aria-hidden="true" className="hidden lg:block h-px flex-1 bg-ink/20" />
                )}
              </span>
              <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-ink">{step.step}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{step.description}</p>
            </li>
          ))}
        </ol>
        </FadeIn>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div key={note.title} className="glass-card rounded-card border-[1.5px] border-ink/10 p-6">
              <p className="font-heading font-semibold text-ink">{note.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-body">{note.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href={proposalHref}
            data-track={`${trackLabel}: request a proposal`}
            className="btn btn-molten min-h-14 px-7 text-base"
          >
            {PROPOSAL_CTA_LABEL} <span aria-hidden="true">&rarr;</span>
          </Link>
          <span className="text-sm text-muted">Takes about two minutes. No call needed.</span>
        </div>
      </div>
    </section>
  );
}
