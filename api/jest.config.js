/** @type {import('jest').Config} */
const config = {
	verbose: true,
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/tests/**/*.test.ts"],
	setupFiles: ["dotenv/config"],
	setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
	modulePathIgnorePatterns: ["dist"],
};

export default config;
