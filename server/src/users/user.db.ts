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

const HOBBIES = [
  "coding",
  "music",
  "gaming",
  "reading",
  "sports",
  "travel",
  "photography",
  "cooking",
  "gardening",
  "painting",
  "dancing",
  "yoga",
  "hiking",
  "cycling",
  "swimming",
  "fishing",
  "writing",
  "blogging",
  "podcasting",
  "woodworking",
  "knitting",
  "chess",
  "movies",
  "anime",
  "volunteering",
  "meditation",
  "running",
  "camping",
  "surfing",
  "skateboarding",
] as const;

const users: User[] = Array.from({ length: 1000 }).map(() => ({
  id: faker.string.uuid(),
  avatar: faker.image.avatar(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  age: faker.number.int({ min: 18, max: 65 }),
  nationality: faker.location.country(),
  hobbies: faker.helpers.arrayElements(
    [...HOBBIES],
    faker.number.int({ min: 1, max: 4 })
  ),
}));

// ============================================================
// QUERY METHODS — Signatures stay the same after DB migration
// ============================================================

export function findUsers(params: GetUsersParams): FindUsersResult {
  const { page = 1, limit = 20, search, nationalities, hobbies } = params;

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

  if (nationalities) {
    const nationalityLower = nationalities.map((nationality) =>
      nationality.toLowerCase()
    );
    filtered = filtered.filter((user) =>
      nationalityLower.includes(user.nationality.toLowerCase())
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

export function getMetadata(): { hobbies: string[]; nationalities: string[] } {
  // In a real DB:
  // MongoDB:  db.users.aggregate([{ $unwind: "$hobbies" }, { $group: { _id: "$hobbies", count: { $sum: 1 } } }])
  // Raw SQL:  SELECT unnest(hobbies) as hobby, COUNT(*) FROM users GROUP BY hobby ORDER BY COUNT(*) DESC LIMIT 20

  const hobbyCounts = new Map<string, number>();
  const nationalityCounts = new Map<string, number>();

  for (const user of users) {
    // Count nationalities
    nationalityCounts.set(
      user.nationality,
      (nationalityCounts.get(user.nationality) ?? 0) + 1
    );

    // Count hobbies
    for (const hobby of user.hobbies) {
      hobbyCounts.set(hobby, (hobbyCounts.get(hobby) ?? 0) + 1);
    }
  }

  const hobbies = [...hobbyCounts.entries()]
    .sort((a, b) => b[1] - a[1]) // sort by count descending
    .slice(0, 20)
    .map(([name]) => name);

  const nationalities = [...nationalityCounts.entries()]
    .sort((a, b) => b[1] - a[1]) // sort by count descending
    .slice(0, 20)
    .map(([name]) => name);

  return { hobbies, nationalities };
}
