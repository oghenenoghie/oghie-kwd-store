import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement the Pointer Events capture API that vaul's
// drawers use for drag handling - without these no-ops, clicking a
// Drawer.Trigger/Close throws "setPointerCapture is not a function".
// Some test files run in a non-DOM environment, where Element doesn't exist.
if (typeof Element !== "undefined") {
  Element.prototype.setPointerCapture ??= () => {};
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.hasPointerCapture ??= () => false;
}

afterEach(() => {
  cleanup();
});
