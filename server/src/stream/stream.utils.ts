// Shared small utilities for all streaming methods

/** Async delay helper */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Async delay helper with optional random delay between min/max milliseconds */
export function delayRandom(
  minMs: number = 5,
  maxMs: number = 5
): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, ms));
}
