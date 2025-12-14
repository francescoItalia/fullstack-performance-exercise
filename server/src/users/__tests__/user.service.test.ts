/**
 * User Service Unit Tests
 *
 * Tests the business logic layer for user operations.
 * These are unit tests - they test the service in isolation.
 *
 * Note: Since we use an in-memory mock database, these tests also
 * implicitly test the DB layer. In a real app with external DB,
 * we'd mock the DB layer here.
 */

import { getUsers, getMetadata } from "../user.service";

describe("User Service", () => {
  // ============================================================
  // getUsers() - Pagination Tests
  // ============================================================

  describe("getUsers() - Pagination", () => {
    it("returns paginated results with default parameters", () => {
      const result = getUsers({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.items).toHaveLength(20);
      expect(result.total).toBeGreaterThan(0);
      expect(typeof result.hasMore).toBe("boolean");
    });

    it("respects custom page and limit", () => {
      const result = getUsers({ page: 2, limit: 10 });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.items.length).toBeLessThanOrEqual(10);
    });

    it("calculates hasMore correctly", () => {
      // First page should have more (assuming > 5 users)
      const firstPage = getUsers({ page: 1, limit: 5 });
      expect(firstPage.hasMore).toBe(true);

      // Request a page way beyond total
      const lastPage = getUsers({ page: 1000, limit: 20 });
      expect(lastPage.hasMore).toBe(false);
      expect(lastPage.items).toHaveLength(0);
    });

    it("returns empty array for page beyond total", () => {
      const result = getUsers({ page: 9999, limit: 20 });

      expect(result.items).toHaveLength(0);
      expect(result.hasMore).toBe(false);
    });
  });

  // ============================================================
  // getUsers() - Search Tests
  // ============================================================

  describe("getUsers() - Search", () => {
    it("filters users by search term (case-insensitive)", () => {
      // Get all users first to find a valid name to search
      const allUsers = getUsers({ limit: 100 });
      const firstUser = allUsers.items[0];
      if (!firstUser) throw new Error("No users found");

      const searchTerm = firstUser.first_name.substring(0, 3).toLowerCase();

      const result = getUsers({ search: searchTerm });

      // All returned users should match the search term
      result.items.forEach((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        expect(fullName).toContain(searchTerm);
      });
    });

    it("returns empty results for non-matching search", () => {
      const result = getUsers({ search: "zzzznonexistent12345" });

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it("search is case-insensitive", () => {
      const allUsers = getUsers({ limit: 1 });
      const firstUser = allUsers.items[0];
      if (!firstUser) throw new Error("No users found");

      const firstName = firstUser.first_name;

      const lowerResult = getUsers({ search: firstName.toLowerCase() });
      const upperResult = getUsers({ search: firstName.toUpperCase() });

      // Both should return the same user
      expect(lowerResult.total).toBe(upperResult.total);
    });
  });

  // ============================================================
  // getUsers() - Filter Tests
  // ============================================================

  describe("getUsers() - Hobby Filtering", () => {
    it("filters users by hobby", () => {
      // Get metadata to find a valid hobby
      const metadata = getMetadata();
      const hobby = metadata.hobbies[0];
      if (!hobby) throw new Error("No hobbies found");

      const result = getUsers({ hobbies: [hobby] });

      // All returned users should have the hobby
      result.items.forEach((user) => {
        const userHobbiesLower = user.hobbies.map((h) => h.toLowerCase());
        expect(userHobbiesLower).toContain(hobby.toLowerCase());
      });
    });

    it("filters by multiple hobbies (OR logic)", () => {
      const metadata = getMetadata();
      const hobbies = metadata.hobbies.slice(0, 2);

      const result = getUsers({ hobbies });

      // Each user should have AT LEAST ONE of the hobbies
      result.items.forEach((user) => {
        const userHobbiesLower = user.hobbies.map((h) => h.toLowerCase());
        const hasMatch = hobbies.some((h) =>
          userHobbiesLower.includes(h.toLowerCase())
        );
        expect(hasMatch).toBe(true);
      });
    });
  });

  describe("getUsers() - Nationality Filtering", () => {
    it("filters users by nationality", () => {
      // Get a user to find a valid nationality
      const allUsers = getUsers({ limit: 100 });
      const firstUser = allUsers.items[0];
      if (!firstUser) throw new Error("No users found");

      const nationality = firstUser.nationality;

      const result = getUsers({ nationalities: [nationality] });

      // All returned users should have the nationality
      result.items.forEach((user) => {
        expect(user.nationality.toLowerCase()).toBe(nationality.toLowerCase());
      });
    });
  });

  describe("getUsers() - Combined Filters", () => {
    it("combines search and hobby filters", () => {
      const metadata = getMetadata();
      const hobby = metadata.hobbies[0];
      if (!hobby) throw new Error("No hobbies found");

      const allUsers = getUsers({ limit: 100 });
      const firstUser = allUsers.items[0];
      if (!firstUser) throw new Error("No users found");

      const searchTerm = firstUser.first_name.substring(0, 2);

      const result = getUsers({
        search: searchTerm,
        hobbies: [hobby],
      });

      // Each result should match both criteria
      result.items.forEach((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        expect(fullName).toContain(searchTerm.toLowerCase());

        const userHobbiesLower = user.hobbies.map((h) => h.toLowerCase());
        expect(userHobbiesLower).toContain(hobby.toLowerCase());
      });
    });
  });

  // ============================================================
  // getUsers() - Response Structure Tests
  // ============================================================

  describe("getUsers() - Response Structure", () => {
    it("returns correct response structure", () => {
      const result = getUsers({});

      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("limit");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("hasMore");

      expect(Array.isArray(result.items)).toBe(true);
      expect(typeof result.page).toBe("number");
      expect(typeof result.limit).toBe("number");
      expect(typeof result.total).toBe("number");
      expect(typeof result.hasMore).toBe("boolean");
    });

    it("each user has required fields", () => {
      const result = getUsers({ limit: 1 });
      const user = result.items[0];
      if (!user) throw new Error("No users found");

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("avatar");
      expect(user).toHaveProperty("first_name");
      expect(user).toHaveProperty("last_name");
      expect(user).toHaveProperty("age");
      expect(user).toHaveProperty("nationality");
      expect(user).toHaveProperty("hobbies");

      expect(typeof user.id).toBe("string");
      expect(typeof user.first_name).toBe("string");
      expect(typeof user.age).toBe("number");
      expect(Array.isArray(user.hobbies)).toBe(true);
    });
  });

  // ============================================================
  // getMetadata() Tests
  // ============================================================

  describe("getMetadata()", () => {
    it("returns hobbies and nationalities arrays", () => {
      const result = getMetadata();

      expect(result).toHaveProperty("hobbies");
      expect(result).toHaveProperty("nationalities");
      expect(Array.isArray(result.hobbies)).toBe(true);
      expect(Array.isArray(result.nationalities)).toBe(true);
    });

    it("returns at most 20 hobbies", () => {
      const result = getMetadata();
      expect(result.hobbies.length).toBeLessThanOrEqual(20);
    });

    it("returns at most 20 nationalities", () => {
      const result = getMetadata();
      expect(result.nationalities.length).toBeLessThanOrEqual(20);
    });

    it("hobbies are strings", () => {
      const result = getMetadata();
      result.hobbies.forEach((hobby) => {
        expect(typeof hobby).toBe("string");
      });
    });
  });
});
