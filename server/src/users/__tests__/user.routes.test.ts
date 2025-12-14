/**
 * User Routes Integration Tests
 *
 * Tests the HTTP API layer for user endpoints.
 * Uses supertest to make real HTTP requests to the Express app.
 *
 * These are integration tests - they test the full request/response cycle:
 * HTTP Request → Controller → Service → DB → Response
 */

import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../../app";

describe("User Routes", () => {
  // ============================================================
  // GET /api/users - List Users
  // ============================================================

  describe("GET /api/users", () => {
    it("returns 200 with paginated users", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("items");
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("limit");
      expect(response.body).toHaveProperty("total");
      expect(response.body).toHaveProperty("hasMore");
    });

    it("returns default pagination (page 1, limit 20)", async () => {
      const response = await request(app).get("/api/users");

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(20);
      expect(response.body.items.length).toBeLessThanOrEqual(20);
    });

    it("respects page query parameter", async () => {
      const response = await request(app).get("/api/users?page=2");

      expect(response.body.page).toBe(2);
    });

    it("respects limit query parameter", async () => {
      const response = await request(app).get("/api/users?limit=5");

      expect(response.body.limit).toBe(5);
      expect(response.body.items.length).toBeLessThanOrEqual(5);
    });

    it("filters by search query", async () => {
      // First get a user to use their name
      const allUsers = await request(app).get("/api/users?limit=1");
      const searchTerm = allUsers.body.items[0].first_name.substring(0, 3);

      const response = await request(app).get(
        `/api/users?search=${searchTerm}`
      );

      expect(response.status).toBe(200);
      response.body.items.forEach(
        (user: { first_name: string; last_name: string }) => {
          const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
          expect(fullName).toContain(searchTerm.toLowerCase());
        }
      );
    });

    it("filters by hobbies (comma-separated)", async () => {
      // Get metadata to find valid hobbies
      const metadata = await request(app).get("/api/users/metadata");
      const hobby = metadata.body.hobbies[0];

      const response = await request(app).get(`/api/users?hobbies=${hobby}`);

      expect(response.status).toBe(200);
      response.body.items.forEach((user: { hobbies: string[] }) => {
        const userHobbiesLower = user.hobbies.map((h) => h.toLowerCase());
        expect(userHobbiesLower).toContain(hobby.toLowerCase());
      });
    });

    it("filters by multiple hobbies", async () => {
      const metadata = await request(app).get("/api/users/metadata");
      const hobbies = metadata.body.hobbies.slice(0, 2).join(",");

      const response = await request(app).get(`/api/users?hobbies=${hobbies}`);

      expect(response.status).toBe(200);
    });

    it("filters by nationalities (comma-separated)", async () => {
      // Get a user to find a valid nationality
      const allUsers = await request(app).get("/api/users?limit=1");
      const nationality = allUsers.body.items[0].nationality;

      const response = await request(app).get(
        `/api/users?nationalities=${nationality}`
      );

      expect(response.status).toBe(200);
      response.body.items.forEach((user: { nationality: string }) => {
        expect(user.nationality.toLowerCase()).toBe(nationality.toLowerCase());
      });
    });

    it("returns correct JSON content-type", async () => {
      const response = await request(app).get("/api/users");

      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });

    it("returns empty items for non-existent page", async () => {
      const response = await request(app).get("/api/users?page=9999");

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(0);
      expect(response.body.hasMore).toBe(false);
    });
  });

  // ============================================================
  // GET /api/users/metadata - Filter Metadata
  // ============================================================

  describe("GET /api/users/metadata", () => {
    it("returns 200 with hobbies and nationalities", async () => {
      const response = await request(app).get("/api/users/metadata");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("hobbies");
      expect(response.body).toHaveProperty("nationalities");
    });

    it("hobbies is an array of strings", async () => {
      const response = await request(app).get("/api/users/metadata");

      expect(Array.isArray(response.body.hobbies)).toBe(true);
      response.body.hobbies.forEach((hobby: unknown) => {
        expect(typeof hobby).toBe("string");
      });
    });

    it("nationalities is an array of strings", async () => {
      const response = await request(app).get("/api/users/metadata");

      expect(Array.isArray(response.body.nationalities)).toBe(true);
      response.body.nationalities.forEach((nationality: unknown) => {
        expect(typeof nationality).toBe("string");
      });
    });

    it("returns at most 20 items in each array", async () => {
      const response = await request(app).get("/api/users/metadata");

      expect(response.body.hobbies.length).toBeLessThanOrEqual(20);
      expect(response.body.nationalities.length).toBeLessThanOrEqual(20);
    });
  });

  // ============================================================
  // Health Check
  // ============================================================

  describe("GET /health", () => {
    it("returns 200 with status ok", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
    });
  });
});
