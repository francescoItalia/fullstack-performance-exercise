/**
 * Stream Routes Integration Tests
 *
 * Tests the HTTP streaming endpoints.
 * Note: These tests verify headers and response format, not real-time streaming behavior.
 *
 * IMPORTANT: We mock the delay functions to make tests run instantly.
 * Without mocking, tests would take 30+ seconds due to character-by-character streaming.
 *
 */

import { jest, describe, it, expect } from "@jest/globals";
import request from "supertest";

// Mock delay functions BEFORE importing app
jest.unstable_mockModule("../stream.utils.js", () => ({
  delay: jest.fn(() => Promise.resolve()),
  delayRandom: jest.fn(() => Promise.resolve()),
}));

// Import app after mocking
const appModule = await import("../../app");
const app = appModule.default;

// Set reasonable timeout (mocked delays are instant)
jest.setTimeout(10000);

describe("Stream Routes", () => {
  // ============================================================
  // GET /api/stream/raw - Raw HTTP Chunked Streaming
  // ============================================================

  describe("GET /api/stream/raw-http-chunked", () => {
    it("returns 200 with correct headers", async () => {
      const response = await request(app).get("/api/stream/raw-http-chunked");

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("text/plain");
      expect(response.headers["transfer-encoding"]).toBe("chunked");
      expect(response.headers["cache-control"]).toBe("no-cache");
    });

    it("returns non-empty text content", async () => {
      const response = await request(app).get("/api/stream/raw-http-chunked");

      expect(response.text.length).toBeGreaterThan(0);
    });

    it("returns multiple paragraphs of text", async () => {
      const response = await request(app).get("/api/stream/raw-http-chunked"); // Waits for res.end()

      // Should contain paragraph breaks (we generate 16 paragraphs)
      expect(response.text).toContain("\n\n");
    });
  });

  // ============================================================
  // GET /api/stream/ndjson - NDJSON Streaming
  // ============================================================

  describe("GET /api/stream/ndjson", () => {
    it("returns 200 with correct headers", async () => {
      const response = await request(app).get("/api/stream/ndjson");

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain(
        "application/x-ndjson"
      );
      expect(response.headers["transfer-encoding"]).toBe("chunked");
    });

    it("returns valid NDJSON (one JSON object per line)", async () => {
      const response = await request(app).get("/api/stream/ndjson");

      const lines = response.text.trim().split("\n");
      expect(lines.length).toBeGreaterThan(0);

      // Each line should be valid JSON
      lines.forEach((line) => {
        expect(() => JSON.parse(line)).not.toThrow();
      });
    });

    it("starts with message_start event", async () => {
      const response = await request(app).get("/api/stream/ndjson");

      const lines = response.text.trim().split("\n");
      expect(lines.length).toBeGreaterThan(0);

      const firstLine = lines[0];
      if (!firstLine) throw new Error("No lines in response");
      const firstEvent = JSON.parse(firstLine);

      expect(firstEvent.type).toBe("message_start");
      expect(firstEvent).toHaveProperty("message_id");
      expect(firstEvent).toHaveProperty("model");
      expect(firstEvent).toHaveProperty("created_at");
    });

    it("ends with message_complete event", async () => {
      const response = await request(app).get("/api/stream/ndjson");

      const lines = response.text.trim().split("\n");
      expect(lines.length).toBeGreaterThan(0);

      const lastLine = lines[lines.length - 1];
      if (!lastLine) throw new Error("No lines in response");
      const lastEvent = JSON.parse(lastLine);

      expect(lastEvent.type).toBe("message_complete");
      expect(lastEvent).toHaveProperty("finish_reason");
      expect(lastEvent).toHaveProperty("usage");
    });

    it("contains delta events with content", async () => {
      const response = await request(app).get("/api/stream/ndjson");

      const lines = response.text.trim().split("\n");
      const events = lines.map((line) => JSON.parse(line));

      // Find delta events
      const deltas = events.filter((e) => e.type === "delta");

      expect(deltas.length).toBeGreaterThan(0);
      deltas.forEach((delta) => {
        expect(delta).toHaveProperty("delta");
        expect(delta.delta).toHaveProperty("content");
      });
    });
  });

  // ============================================================
  // GET /api/stream/sse - Server-Sent Events
  // ============================================================

  describe("GET /api/stream/sse", () => {
    it("returns 200 with correct SSE headers", async () => {
      const response = await request(app).get("/api/stream/sse");

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("text/event-stream");
      expect(response.headers["cache-control"]).toBe("no-cache");
      expect(response.headers["connection"]).toBe("keep-alive");
    });

    it("returns valid SSE format with event and data lines", async () => {
      const response = await request(app).get("/api/stream/sse");

      // SSE format: "event: type\ndata: {...}\n\n"
      expect(response.text).toContain("event:");
      expect(response.text).toContain("data:");
    });

    it("contains expected event types", async () => {
      const response = await request(app).get("/api/stream/sse");

      expect(response.text).toContain("event: message_start");
      expect(response.text).toContain("event: delta");
      expect(response.text).toContain("event: message_complete");
    });

    it("ends with [DONE] marker", async () => {
      const response = await request(app).get("/api/stream/sse");

      expect(response.text).toContain("data: [DONE]");
    });
  });
});
