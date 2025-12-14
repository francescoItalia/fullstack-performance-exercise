/**
 * useDebouncedValue Hook Tests
 *
 * Tests the debouncing behavior of the hook.
 */

import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "../useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ============================================================
  // Initial Value Tests
  // ============================================================

  describe("initial value", () => {
    it("returns initial value immediately", () => {
      const { result } = renderHook(() => useDebouncedValue("initial"));
      expect(result.current).toBe("initial");
    });

    it("works with different types", () => {
      const { result: numberResult } = renderHook(() => useDebouncedValue(42));
      expect(numberResult.current).toBe(42);

      const { result: objectResult } = renderHook(() =>
        useDebouncedValue({ key: "value" })
      );
      expect(objectResult.current).toEqual({ key: "value" });
    });
  });

  // ============================================================
  // Debouncing Behavior Tests
  // ============================================================

  describe("debouncing", () => {
    it("does not update value before delay", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 500),
        { initialProps: { value: "initial" } }
      );

      rerender({ value: "updated" });

      // Value should still be initial before delay
      expect(result.current).toBe("initial");

      // Advance time but not enough
      act(() => vi.advanceTimersByTime(400));
      expect(result.current).toBe("initial");
    });

    it("updates value after delay", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 500),
        { initialProps: { value: "initial" } }
      );

      rerender({ value: "updated" });

      // Advance time past delay
      act(() => vi.advanceTimersByTime(500));
      expect(result.current).toBe("updated");
    });

    it("uses default delay of 500ms", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value),
        { initialProps: { value: "initial" } }
      );

      rerender({ value: "updated" });

      // At 499ms, should still be old value
      act(() => vi.advanceTimersByTime(499));
      expect(result.current).toBe("initial");

      // At 500ms, should update
      act(() => vi.advanceTimersByTime(1));
      expect(result.current).toBe("updated");
    });
  });

  // ============================================================
  // Rapid Changes Tests
  // ============================================================

  describe("rapid changes", () => {
    it("only uses the last value after rapid changes", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 500),
        { initialProps: { value: "initial" } }
      );

      // Rapid changes
      rerender({ value: "change1" });
      act(() => vi.advanceTimersByTime(100));

      rerender({ value: "change2" });
      act(() => vi.advanceTimersByTime(100));

      rerender({ value: "change3" });
      act(() => vi.advanceTimersByTime(100));

      rerender({ value: "final" });

      // Still initial because delay hasn't completed
      expect(result.current).toBe("initial");

      // Complete the delay from the last change
      act(() => vi.advanceTimersByTime(500));
      expect(result.current).toBe("final");
    });

    it("resets timer on each change", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 500),
        { initialProps: { value: "initial" } }
      );

      rerender({ value: "change1" });
      act(() => vi.advanceTimersByTime(400));

      // This should reset the timer
      rerender({ value: "change2" });
      act(() => vi.advanceTimersByTime(400));

      // Still initial because timer was reset
      expect(result.current).toBe("initial");

      // Complete the delay
      act(() => vi.advanceTimersByTime(100));
      expect(result.current).toBe("change2");
    });
  });
});

