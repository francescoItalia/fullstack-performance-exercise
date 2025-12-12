import { faker } from "@faker-js/faker";
import { delay, delayRandom } from "./stream.utils.js";

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

/**
 * SSE: Job progress simulation
 * @returns An async generator of JobProgressEvent.
 */

export type JobProgressEvent = {
  step: string;
  progress: number; // 0–100
  message: string;
};

export async function* streamJobProgress(): AsyncGenerator<JobProgressEvent> {
  const steps = [
    "uploading video",
    "extracting frames",
    "generating final report",
  ];

  const progressStep = 20;

  for (const step of steps) {
    for (let progress = 0; progress <= 100; progress += progressStep) {
      yield {
        step,
        progress,
        message: `${step}... ${progress}%`,
      };

      await delayRandom(500, 3000);
    }
  }
}
