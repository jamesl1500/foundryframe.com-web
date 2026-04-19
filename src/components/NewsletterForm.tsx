/**
 * NewsletterForm Component — Foundry Frame
 *
 * Flat, minimal newsletter form. No rounded corners.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

interface NewsletterFormProps {
  variant?: "inline" | "stacked";
  className?: string;
  placeholder?: string;
  buttonText?: string;
}

export default function NewsletterForm({
  variant = "stacked",
  className = "",
  placeholder = "Your email",
  buttonText = "Subscribe",
}: NewsletterFormProps) {
  return (
    <form
      className={`flex ${
        variant === "inline" ? "flex-col sm:flex-row" : "flex-col"
      } gap-2 ${className}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder={placeholder}
        className={`${
          variant === "inline" ? "flex-1" : "w-full"
        } px-3 py-2 bg-transparent border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white transition-colors`}
        aria-label="Email address for newsletter"
      />
      <button
        type="submit"
        className={`${
          variant === "inline" ? "" : "w-full"
        } px-4 py-2 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors`}
      >
        {buttonText}
      </button>
    </form>
  );
}
