import { compilerOptions } from "./tsconfig.json";
import type { Config } from "jest";
import nextJest from "next/jest.js";
import { pathsToModuleNameMapper, type JestConfigWithTsJest } from "ts-jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./testSetup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
