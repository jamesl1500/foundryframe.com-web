"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface CaseStudyImagesProps {
  title: string;
  coverUrl?: string | null;
  galleryUrls: string[];
}

/* Same outline icon style as the header menu. */
const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/* Round glass pill matching the site's .btn-glass buttons. */
const iconButton = "btn btn-glass min-h-11 w-11 p-0";

interface LightboxImage {
  src: string;
  alt: string;
}

/* Cover + gallery for a case study detail page. Clicking any image opens it
   full-size in a native <dialog> (focus trap, Escape, and inert page come
   from the browser). Arrow keys / buttons step through every image. */
export default function CaseStudyImages({
  title,
  coverUrl,
  galleryUrls,
}: CaseStudyImagesProps) {
  const images: LightboxImage[] = [
    ...(coverUrl ? [{ src: coverUrl, alt: title }] : []),
    ...galleryUrls.map((src, index) => ({
      src,
      alt: `${title} gallery image ${index + 1}`,
    })),
  ];
  const galleryOffset = coverUrl ? 1 : 0;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const open = activeIndex !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();

    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [open]);

  if (images.length === 0) return null;

  const hasMultiple = images.length > 1;
  const step = (delta: number) =>
    setActiveIndex((current) =>
      current === null
        ? current
        : (current + delta + images.length) % images.length,
    );

  function onKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (!hasMultiple) return;
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  }

  /* Clicks on the dim area (dialog or its padding wrapper), not the image
     or controls, close the lightbox. */
  function onBackdropClick(event: React.MouseEvent<HTMLElement>) {
    if (event.target === event.currentTarget) setActiveIndex(null);
  }

  const active = activeIndex === null ? null : images[activeIndex];

  return (
    <>
      {coverUrl ? (
        <button
          type="button"
          onClick={() => setActiveIndex(0)}
          aria-label={`View full image: ${title}`}
          className="block w-full mb-10 cursor-zoom-in"
        >
          <Image
            src={coverUrl}
            alt={title}
            width={1600}
            height={900}
            className="w-full h-auto border border-ink/10"
          />
        </button>
      ) : null}

      {galleryUrls.length > 0 ? (
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-muted mb-4">
            Project Gallery
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {galleryUrls.map((imageUrl, index) => (
              <button
                key={`${imageUrl}-${index}`}
                type="button"
                onClick={() => setActiveIndex(galleryOffset + index)}
                aria-label={`View full image: ${title} gallery image ${index + 1}`}
                className="block cursor-zoom-in overflow-hidden"
              >
                <Image
                  src={imageUrl}
                  alt={`${title} gallery image ${index + 1}`}
                  width={1000}
                  height={750}
                  className="w-full h-48 object-cover border border-ink/10 transition-transform duration-300 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        aria-label={active ? active.alt : "Image viewer"}
        onClose={() => setActiveIndex(null)}
        onKeyDown={onKeyDown}
        onClick={onBackdropClick}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-ink backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
      >
        {active ? (
          <div
            onClick={onBackdropClick}
            className="relative flex h-full w-full items-center justify-center p-4 sm:p-12"
          >
            <div className="relative h-full w-full">
              <Image
                key={active.src}
                src={active.src}
                alt={active.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close image"
              autoFocus
              className={`${iconButton} absolute right-3 top-3`}
            >
              <svg {...iconProps}>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {hasMultiple ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className={`${iconButton} absolute left-3 top-1/2 -translate-y-1/2`}
                >
                  <svg {...iconProps}>
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className={`${iconButton} absolute right-3 top-1/2 -translate-y-1/2`}
                >
                  <svg {...iconProps}>
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <p
                  aria-live="polite"
                  className="eyebrow absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90"
                >
                  {(activeIndex ?? 0) + 1} / {images.length}
                </p>
              </>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
