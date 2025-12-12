import { faker } from "@faker-js/faker";
import { delay } from "./stream.utils.js";

/**
 * Generate a long text string (simulating heavy content)
 */
export function streamGeneratedText(): string {
  return faker.lorem.paragraphs(16, "\n\n");
}

/**
 * Simulates an AI model generating text token-by-token (word based).
 */
export async function* streamGeneratedToken(): AsyncGenerator<string> {
  const sentence = faker.lorem.paragraphs(16, "\n\n");

  const tokens = sentence.split(/\s+/); // split by spaces

  for (const token of tokens) {
    yield token;
    await delay(100); // slow, visible streaming
  }
}
