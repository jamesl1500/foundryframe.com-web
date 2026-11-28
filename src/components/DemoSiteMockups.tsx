/**
 * Demo Site Mockups - Foundry Frame
 * ===================================
 * Small, coded previews of demo client sites for the homepage hero: a
 * desktop browser frame and a phone frame, each showing a sample site for a
 * fictional local business. They're drawn in HTML rather than screenshots
 * so they stay sharp at any size and cost no extra image weight; swap in
 * real demo-site screenshots here once they exist.
 *
 * Each mockup is one labelled image to assistive tech (role="img"), so its
 * pretend nav links and buttons aren't announced as real controls.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import Photo from "@/components/media/Photo";

/* --- Desktop: a contractor's site in a browser window --- */
export function BrowserDemo({ preload = false }: { preload?: boolean }) {
  return (
    <div
      role="img"
      aria-label="Demo website for Ridgeline Builders, a fictional contractor: a homepage with a job-site photo, the headline Built right the first time, and a Get a free estimate button."
      className="flex h-full w-full flex-col overflow-hidden rounded-panel border-[1.5px] border-ink bg-white shadow-[0_18px_40px_-18px_rgba(23,20,15,0.45)]"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-ink/10 bg-sand px-3 py-2">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-ink/25" />
          <span className="h-2 w-2 rounded-full bg-ink/25" />
          <span className="h-2 w-2 rounded-full bg-ink/25" />
        </span>
        <span className="mx-auto truncate rounded-full bg-white px-3 py-0.5 font-mono text-[9px] text-muted">
          ridgelinebuilders.com
        </span>
        <span className="rounded-full bg-ink px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white">
          Demo
        </span>
      </div>

      {/* Site nav */}
      <div className="flex items-center justify-between bg-[#1f2a24] px-3 py-2 text-white">
        <span className="font-heading text-[11px] font-bold tracking-tight">
          RIDGELINE<span className="text-[#e0a64b]"> ▲</span>
        </span>
        <span className="hidden gap-2.5 text-[8px] text-white/70 sm:flex">
          <span>Services</span>
          <span>Projects</span>
          <span>About</span>
        </span>
        <span className="rounded-full bg-[#e0a64b] px-2 py-0.5 text-[8px] font-semibold text-[#1f2a24]">
          Call now
        </span>
      </div>

      {/* Hero */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns">
          <Photo name="contractor" alt="" sizes="(min-width: 1024px) 28vw, 76vw" preload={preload} />
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-[#1f2a24]/90 via-[#1f2a24]/55 to-transparent" />
        {/* Top-aligned so the hero's Spark ticket, which overlaps this
            frame's lower half, doesn't cover the headline and button. */}
        <div className="relative flex h-full max-w-[70%] flex-col justify-start gap-2 p-4 pt-5 text-white">
          <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#e0a64b]">
            Lorain County · Since 1998
          </span>
          <span className="font-heading text-lg font-bold leading-[1.05] sm:text-xl">
            Built right the first time.
          </span>
          <span className="text-[9px] leading-snug text-white/75">
            Roofing, additions, and remodels with a written estimate in 48 hours.
          </span>
          <span className="mt-1 w-fit rounded-full bg-[#e0a64b] px-3 py-1 text-[9px] font-semibold text-[#1f2a24]">
            Get a free estimate
          </span>
        </div>
      </div>

      {/* Service strip */}
      <div className="grid grid-cols-3 divide-x divide-ink/10 border-t border-ink/10 bg-white text-center">
        {["Roofing", "Additions", "Remodels"].map((service) => (
          <span key={service} className="py-2 text-[9px] font-semibold text-[#1f2a24]">
            {service}
          </span>
        ))}
      </div>
    </div>
  );
}

/* --- Mobile: a fitness studio's site on a phone --- */
export function PhoneDemo() {
  return (
    <div
      role="img"
      aria-label="Demo mobile website for Harbor Fitness, a fictional gym: a class photo, a Book a free class button, and today's class schedule."
      className="h-full w-full rounded-[1.6rem] border-[1.5px] border-ink bg-ink p-1.5 shadow-[0_18px_40px_-18px_rgba(23,20,15,0.55)]"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-[#f4f1ec]">
        {/* Status bar + header */}
        <div className="flex items-center justify-between px-3 pt-2 text-[7px] font-semibold text-ink/70">
          <span>9:41</span>
          <span className="h-1.5 w-8 rounded-full bg-ink" />
          <span>100%</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <span className="font-heading text-[10px] font-bold tracking-tight text-[#203a5c]">
            harbor<span className="text-[#ff6b4a]">●</span>fitness
          </span>
          <span className="flex flex-col gap-[3px]">
            <span className="h-[1.5px] w-3 bg-[#203a5c]" />
            <span className="h-[1.5px] w-3 bg-[#203a5c]" />
          </span>
        </div>

        {/* Hero photo */}
        <div className="relative mx-2 h-[38%] overflow-hidden rounded-xl">
          <Photo name="fitness" alt="" sizes="(min-width: 1024px) 12vw, 36vw" />
          <div className="absolute inset-0 bg-linear-to-t from-[#203a5c]/85 to-transparent" />
          <span className="absolute inset-x-2 bottom-2 font-heading text-[11px] font-bold leading-tight text-white">
            Stronger starts here.
          </span>
        </div>

        <span className="mx-2 mt-2 rounded-full bg-[#ff6b4a] py-1.5 text-center text-[8px] font-semibold text-white">
          Book a free class
        </span>

        {/* Schedule */}
        <div className="mx-2 mt-2 flex flex-col gap-1">
          <span className="text-[7px] font-semibold uppercase tracking-[0.14em] text-ink/50">Today</span>
          {[
            ["6:00a", "Strength"],
            ["12:15p", "HIIT 30"],
            ["5:30p", "Mobility"],
          ].map(([time, name]) => (
            <span
              key={time}
              className="flex items-center justify-between rounded-md bg-white px-2 py-1 text-[8px] text-[#203a5c]"
            >
              <span className="font-mono">{time}</span>
              <span className="font-semibold">{name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
