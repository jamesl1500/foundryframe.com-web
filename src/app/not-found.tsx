/**
 * Not Found Page - Foundry Frame
 * ================================
 * Flat, minimal 404 page.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
        <div className="text-[10rem] sm:text-[14rem] font-heading font-bold text-muted leading-none select-none">
          404
        </div>

        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-ink -mt-16 mb-4">
          Page not found
        </h1>
        <p className="text-muted text-sm mb-10 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="btn btn-primary"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="btn btn-glass"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
