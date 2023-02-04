/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 * */
module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testEnvironment: "node",
  roots: ["<rootDir>/tests", "<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/jest-set-up/index.ts"],
};
