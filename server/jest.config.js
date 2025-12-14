/**
 * Jest Configuration for TypeScript Node.js Server
 *
 * Uses ts-jest to handle TypeScript compilation.
 * Configured for ESM module resolution to match our package.json "type": "module".
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // Use ts-jest preset for TypeScript support
  preset: "ts-jest/presets/default-esm",

  // Test environment
  testEnvironment: "node",

  // File extensions to consider
  moduleFileExtensions: ["ts", "js", "json"],

  // Where to find tests
  roots: ["<rootDir>/src"],

  // Test file patterns
  testMatch: ["**/__tests__/**/*.test.ts"],

  // Transform TypeScript files with ts-jest
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },

  // Handle ESM module resolution
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    // Remove .js extension from imports for test resolution
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!src/server.ts", // Entry point
  ],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output for better debugging
  verbose: true,

  // Silence console.log during tests (cleaner output)
  silent: true,

  // Force exit after tests complete (don't wait for open handles)
  forceExit: true,

  // Timeout per test (10 seconds should be plenty with mocked delays)
  testTimeout: 10000,
};
