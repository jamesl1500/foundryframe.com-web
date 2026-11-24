/* Adds DOM matchers (toBeInTheDocument, toHaveTextContent, ...) for the
   jsdom component tests; harmless in Node tests. */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
