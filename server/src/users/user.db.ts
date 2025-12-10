import type { User, GetUsersParams } from "shared";
import { faker } from "@faker-js/faker";

export type FindUsersResult = {
  items: User[];
  total: number;
};

/**
 * Data access layer for users.
 *
 * Currently in-memory mock data. When migrating to a real DB:
 * 1. Remove the mock data section below
 * 2. Replace query implementations with ORM calls (Mongoose, Prisma, etc.)
 * 3. Function signatures stay the same — service layer remains untouched
 */

// ============================================================
// MOCK DATA — Replace with actual DB connection
// ============================================================

const users: User[] = Array.from({ length: 1000 }).map(() => ({
  id: faker.string.uuid(),
  avatar: faker.image.avatar(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  age: faker.number.int({ min: 18, max: 65 }),
  nationality: faker.location.country(),
  hobbies: faker.helpers.arrayElements(
    ["coding", "music", "gaming", "reading", "sports", "travel"],
    faker.number.int({ min: 1, max: 4 })
  ),
}));

// ============================================================
// QUERY METHODS — Signatures stay the same after DB migration
// ============================================================

export function findUsers(params: GetUsersParams): FindUsersResult {
  const { page = 1, limit = 20, search, nationality, hobbies } = params;

  // In a real DB, this would be a single query with WHERE clauses:
  // MongoDB:  User.find({ first_name: /search/i }).skip(offset).limit(limit)
  // Prisma:   prisma.user.findMany({ where: {...}, skip, take })
  // Raw SQL:  SELECT * FROM users WHERE ... LIMIT ? OFFSET ?

  let filtered = users;

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchLower) ||
        user.last_name.toLowerCase().includes(searchLower)
    );
  }

  if (nationality) {
    const nationalityLower = nationality.toLowerCase();
    filtered = filtered.filter(
      (user) => user.nationality.toLowerCase() === nationalityLower
    );
  }

  if (hobbies && hobbies.length > 0) {
    filtered = filtered.filter((user) =>
      hobbies.every((hobby) =>
        user.hobbies.map((h) => h.toLowerCase()).includes(hobby.toLowerCase())
      )
    );
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const items = filtered.slice(startIndex, startIndex + limit);

  return { items, total };
}
