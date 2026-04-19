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
    <section className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
        <div className="text-[10rem] sm:text-[14rem] font-heading font-bold text-white/5 leading-none select-none">
          404
        </div>

        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white -mt-16 mb-4">
          Page not found
        </h1>
        <p className="text-gray-500 text-sm mb-10 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-3 bg-white text-black text-sm font-medium uppercase tracking-wider hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 border border-white/20 text-white text-sm font-medium uppercase tracking-wider hover:bg-white/5 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
