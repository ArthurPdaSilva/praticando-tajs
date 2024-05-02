/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  coverageProvider: "v8",
  collectCoverage: true,
  testEnvironment: "node",
  testRunner: "jest-circus/runner",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};

module.exports = config;
