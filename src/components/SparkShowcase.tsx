/**
 * Spark Showcase - Foundry Frame
 * ================================
 * Interactive preview of what The Spark includes: five tabs (Home, About,
 * Services, Contact, +1) that each swap a browser mockup to a sample page
 * for an example coffee shop. The tabs advance on their own every few
 * seconds until the visitor hovers, focuses, or picks one; reduced-motion
 * visitors get no auto-advance.
 *
 * Every panel is rendered (stacked, cross-fading) so switching is instant
 * and the photos are already loaded; inactive panels are inert and hidden
 * from assistive tech.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Photo from "@/components/media/Photo";

const ADVANCE_MS = 4200;

type Page = {
  id: string;
  tab: string;
  path: string;
  purpose: string;
};

const pages: Page[] = [
  {
    id: "home",
    tab: "Home",
    path: "",
    purpose: "Your first impression. Says what you do in five seconds and points to one clear next step.",
  },
  {
    id: "about",
    tab: "About",
    path: "/about",
    purpose: "The story and the faces behind the business, which is why people pick a local shop over a chain.",
  },
  {
    id: "services",
    tab: "Services",
    path: "/menu",
    purpose: "What you sell and what it costs, laid out so visitors find their answer without calling.",
  },
  {
    id: "contact",
    tab: "Contact",
    path: "/visit",
    purpose: "A contact form that emails you instantly, plus a Google Map with directions in one tap.",
  },
  {
    id: "extra",
    tab: "+1 Your Pick",
    path: "/gallery",
    purpose: "One more page of your choosing: a gallery, pricing, FAQ, or a second service page.",
  },
];

/* --- Sample page bodies, drawn as a simplified site for an example shop --- */
function SampleNav({ active }: { active: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-ink/10 bg-paper">
      <span className="font-heading font-bold text-[13px] tracking-tight text-ink">
        Lakeside<span className="text-molten-deep">.</span>
      </span>
      <span className="hidden sm:flex items-center gap-3 text-[11px] text-muted">
        {["Home", "About", "Menu", "Visit"].map((item) => (
          <span
            key={item}
            className={item === active ? "text-ink font-semibold underline underline-offset-4 decoration-molten decoration-2" : ""}
          >
            {item}
          </span>
        ))}
      </span>
      <span className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold text-white">
        Order ahead
      </span>
    </div>
  );
}

function PageBody({ id }: { id: string }) {
  switch (id) {
    case "home":
      return (
        <>
          <SampleNav active="Home" />
          <div className="relative h-[calc(100%-45px)]">
            <Photo name="barista" alt="" sizes="(min-width: 1024px) 40vw, 90vw" />
            <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">Lorain, Ohio</p>
              <p className="mt-2 max-w-xs font-heading text-2xl sm:text-3xl font-bold leading-[1.05] text-white">
                Small-batch coffee, roasted down the street.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-molten px-3 py-1.5 text-[11px] font-semibold text-ink">See the menu</span>
                <span className="rounded-full border border-white/60 px-3 py-1.5 text-[11px] font-semibold text-white">Get directions</span>
              </div>
            </div>
          </div>
        </>
      );
    case "about":
      return (
        <>
          <SampleNav active="About" />
          <div className="grid h-[calc(100%-45px)] grid-cols-5">
            <div className="col-span-2 relative">
              <Photo name="shopOwners" alt="" sizes="(min-width: 1024px) 18vw, 40vw" />
            </div>
            <div className="col-span-3 p-5 sm:p-7 flex flex-col justify-center bg-paper">
              <p className="text-[10px] uppercase tracking-[0.2em] text-molten-deep font-semibold">Our story</p>
              <p className="mt-2 font-heading text-xl sm:text-2xl font-bold leading-tight text-ink">
                Two friends, one espresso machine, and a lot of early mornings.
              </p>
              <div className="mt-4 space-y-2" aria-hidden="true">
                <div className="h-2 w-full rounded-full bg-ink/10" />
                <div className="h-2 w-11/12 rounded-full bg-ink/10" />
                <div className="h-2 w-4/5 rounded-full bg-ink/10" />
              </div>
              <div className="mt-5 flex gap-4">
                <span>
                  <span className="block font-heading text-lg font-bold text-ink">2019</span>
                  <span className="text-[10px] text-muted">Opened</span>
                </span>
                <span>
                  <span className="block font-heading text-lg font-bold text-ink">4.9★</span>
                  <span className="text-[10px] text-muted">Google rating</span>
                </span>
              </div>
            </div>
          </div>
        </>
      );
    case "services":
      return (
        <>
          <SampleNav active="Menu" />
          <div className="h-[calc(100%-45px)] p-4 sm:p-6 bg-canvas">
            <p className="font-heading text-xl font-bold text-ink">The menu</p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
              {(
                [
                  ["coffeeCounter", "Espresso bar", "$3–6"],
                  ["coffeeBrand", "Beans to go", "$16"],
                  ["chef", "Kitchen", "$8–12"],
                ] as const
              ).map(([photo, label, price]) => (
                <div key={label} className="rounded-lg border border-ink/10 bg-paper overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Photo name={photo} alt="" sizes="(min-width: 1024px) 12vw, 28vw" />
                  </div>
                  <div className="p-2 sm:p-3">
                    <p className="text-[11px] sm:text-xs font-semibold text-ink">{label}</p>
                    <p className="text-[10px] text-muted">{price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-ink px-4 py-3 flex items-center justify-between">
              <span className="text-[11px] text-white/80">Catering for offices &amp; events</span>
              <span className="rounded-full bg-molten px-3 py-1 text-[10px] font-semibold text-ink">Request a quote</span>
            </div>
          </div>
        </>
      );
    case "contact":
      return (
        <>
          <SampleNav active="Visit" />
          <div className="grid h-[calc(100%-45px)] grid-cols-2">
            <div className="p-4 sm:p-6 bg-paper flex flex-col justify-center gap-2.5" aria-hidden="true">
              <p className="font-heading text-xl font-bold text-ink">Say hello</p>
              {["Name", "Email", "Message"].map((field) => (
                <div key={field}>
                  <span className="text-[10px] text-muted">{field}</span>
                  <div className={`mt-0.5 rounded-md border border-ink/15 bg-canvas ${field === "Message" ? "h-12" : "h-6"}`} />
                </div>
              ))}
              <span className="self-start rounded-full bg-ink px-3 py-1.5 text-[10px] font-semibold text-white">Send message</span>
            </div>
            {/* A stylized map: street grid and a pin */}
            <div className="relative overflow-hidden bg-[#E7EEDF]" aria-hidden="true">
              <div className="absolute inset-0 [background-image:linear-gradient(#fff_2px,transparent_2px),linear-gradient(90deg,#fff_2px,transparent_2px)] [background-size:34px_34px] opacity-90" />
              <div className="absolute left-0 right-0 top-[58%] h-3 bg-[#F6D9A8] -rotate-6" />
              <div className="absolute top-0 bottom-0 left-[38%] w-3 bg-[#F6D9A8] rotate-3" />
              <div className="absolute -right-8 -bottom-10 h-28 w-40 rounded-full bg-[#BFD9EE]" />
              <span className="absolute left-[40%] top-[44%] -translate-x-1/2 -translate-y-full">
                <span className="block h-7 w-7 rounded-full rounded-br-none rotate-45 bg-molten border-2 border-ink" />
              </span>
              <span className="absolute bottom-3 left-3 rounded-md bg-paper px-2 py-1 text-[10px] font-semibold text-ink border border-ink/10">
                Directions &rarr;
              </span>
            </div>
          </div>
        </>
      );
    default:
      return (
        <>
          <SampleNav active="" />
          <div className="h-[calc(100%-45px)] p-3 sm:p-4 bg-canvas grid grid-cols-3 grid-rows-2 gap-2">
            <div className="relative col-span-2 row-span-2 rounded-lg overflow-hidden">
              <Photo name="coffeeCounter" alt="" sizes="(min-width: 1024px) 26vw, 60vw" />
            </div>
            <div className="relative rounded-lg overflow-hidden">
              <Photo name="coffeeBrand" alt="" sizes="(min-width: 1024px) 13vw, 30vw" />
            </div>
            <div className="relative rounded-lg overflow-hidden">
              <Photo name="barista" alt="" sizes="(min-width: 1024px) 13vw, 30vw" />
            </div>
          </div>
        </>
      );
  }
}

export default function SparkShowcase() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false);
  const [paused, setPaused] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Auto-advance only for motion-OK visitors, and only while on screen. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setAuto(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = auto && !paused;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setActive((i) => (i + 1) % pages.length), ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [running, active]);

  function choose(index: number) {
    setActive(index);
    // A deliberate pick stops the slideshow for good.
    setAuto(false);
    setPaused(true);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = {
      ArrowRight: (active + 1) % pages.length,
      ArrowLeft: (active - 1 + pages.length) % pages.length,
      Home: 0,
      End: pages.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = keys[e.key];
    choose(next);
    tabRefs.current[next]?.focus();
  }

  const page = pages[active];

  return (
    <div
      ref={rootRef}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && auto && setPaused(false)}
    >
      {/* --- Tabs --- */}
      <div
        role="tablist"
        aria-label="Pages included with The Spark"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2"
      >
        {pages.map((p, i) => {
          const selected = i === active;
          return (
            <button
              key={p.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`spark-tab-${p.id}`}
              aria-selected={selected}
              aria-controls={`spark-panel-${p.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(i)}
              className={`relative overflow-hidden rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold transition-colors ${
                selected
                  ? "border-molten bg-molten text-ink"
                  : "border-white/30 text-white/80 hover:border-white hover:text-white"
              }`}
            >
              <span className="relative z-10">
                <span className="mr-1.5 font-mono text-xs opacity-70">0{i + 1}</span>
                {p.tab}
              </span>
              {/* Countdown to the next tab while auto-advancing */}
              {selected && running && (
                <span
                  key={active}
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 bg-white/35"
                  style={{ animation: `spark-progress ${ADVANCE_MS}ms linear forwards` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* --- Browser mockup --- */}
      <div className="mt-5 rounded-card border-[1.5px] border-white/80 bg-paper overflow-hidden shadow-[10px_10px_0_var(--color-molten)]">
        <div className="flex items-center gap-3 border-b border-ink/10 bg-sand px-4 py-2.5" aria-hidden="true">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-molten" />
          </span>
          <span className="flex-1 truncate rounded-full bg-paper px-3 py-1 text-[11px] text-muted">
            yourbusiness.com<span className="text-ink">{page.path}</span>
          </span>
        </div>
        <div className="relative aspect-[4/3] sm:aspect-[16/11]">
          {pages.map((p, i) => {
            const selected = i === active;
            return (
              <div
                key={p.id}
                role="tabpanel"
                id={`spark-panel-${p.id}`}
                aria-labelledby={`spark-tab-${p.id}`}
                aria-hidden={!selected}
                inert={!selected}
                className={`absolute inset-0 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
                }`}
              >
                <span className="sr-only">
                  Sample {p.tab.replace("+1 ", "")} page: {p.purpose}
                </span>
                <PageBody id={p.id} />
              </div>
            );
          })}
        </div>
      </div>

      {/* --- What this page does --- */}
      <p aria-live={running ? "off" : "polite"} className="mt-6 min-h-[3rem] text-white/80 text-sm sm:text-base leading-relaxed max-w-xl">
        <span className="font-semibold text-white">{page.tab}: </span>
        {page.purpose}
      </p>
    </div>
  );
}
