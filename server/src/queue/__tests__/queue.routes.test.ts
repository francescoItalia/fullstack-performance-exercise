/**
 * Queue Routes Integration Tests
 *
 * Tests the HTTP API for queue operations.
 * Note: These tests verify the HTTP layer behavior.
 * The actual job processing (worker/WebSocket) is not tested here.
 *
 */

import { jest, describe, it, expect } from "@jest/globals";
import request from "supertest";

// Mock worker_threads to prevent actual worker creation
jest.unstable_mockModule("worker_threads", () => ({
  Worker: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    postMessage: jest.fn(),
    terminate: jest.fn(),
  })),
}));

// Mock WebSocket service
jest.unstable_mockModule("../../websocket/ws.service.js", () => ({
  broadcastResult: jest.fn(),
}));

// Import app after mocking
const appModule = await import("../../app");
const app = appModule.default;

describe("Queue Routes", () => {
  // ============================================================
  // POST /api/queue/submit - Submit Job
  // ============================================================

  describe("POST /api/queue/submit", () => {
    it("returns 202 Accepted with pending status", async () => {
      const response = await request(app)
        .post("/api/queue/submit")
        .send({ payload: { test: "data" } });

      expect(response.status).toBe(202);
      expect(response.body.status).toBe("pending");
    });

    it("returns requestId in response", async () => {
      const response = await request(app)
        .post("/api/queue/submit")
        .send({ payload: { test: "data" } });

      expect(response.body).toHaveProperty("requestId");
      expect(typeof response.body.requestId).toBe("string");
    });

    it("returns queuedAt timestamp", async () => {
      const before = Date.now();
      const response = await request(app)
        .post("/api/queue/submit")
        .send({ payload: {} });
      const after = Date.now();

      expect(response.body).toHaveProperty("queuedAt");
      expect(response.body.queuedAt).toBeGreaterThanOrEqual(before);
      expect(response.body.queuedAt).toBeLessThanOrEqual(after);
    });

    it("accepts empty payload", async () => {
      const response = await request(app).post("/api/queue/submit").send({});

      expect(response.status).toBe(202);
      expect(response.body.status).toBe("pending");
    });

    it("generates unique requestIds for each submission", async () => {
      const [res1, res2, res3] = await Promise.all([
        request(app).post("/api/queue/submit").send({ id: 1 }),
        request(app).post("/api/queue/submit").send({ id: 2 }),
        request(app).post("/api/queue/submit").send({ id: 3 }),
      ]);

      const ids = [
        res1.body.requestId,
        res2.body.requestId,
        res3.body.requestId,
      ];
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
    });

    it("returns JSON content-type", async () => {
      const response = await request(app)
        .post("/api/queue/submit")
        .send({ payload: {} });

      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });
  });

  // ============================================================
  // GET /api/queue/status - Queue Status
  // ============================================================

  describe("GET /api/queue/status", () => {
    it("returns 200 with queue status", async () => {
      const response = await request(app).get("/api/queue/status");

      expect(response.status).toBe(200);
    });

    it("returns queueSize", async () => {
      const response = await request(app).get("/api/queue/status");

      expect(response.body).toHaveProperty("queueSize");
      expect(typeof response.body.queueSize).toBe("number");
    });

    it("returns isProcessing", async () => {
      const response = await request(app).get("/api/queue/status");

      expect(response.body).toHaveProperty("isProcessing");
      expect(typeof response.body.isProcessing).toBe("boolean");
    });

    it("returns JSON content-type", async () => {
      const response = await request(app).get("/api/queue/status");

      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });
  });
});
