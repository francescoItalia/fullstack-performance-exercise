// Shared small utilities for all streaming methods

/** Async delay helper */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
