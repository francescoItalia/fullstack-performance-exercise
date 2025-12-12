import { faker } from "@faker-js/faker";

/**
 * Generate a long text string (simulating heavy content)
 */
export function streamGeneratedText(): string {
  return faker.lorem.paragraphs(16, "\n\n");
}
