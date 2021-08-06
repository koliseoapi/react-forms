// Jest config
// See https://facebook.github.io/jest/docs/en/configuration.html
module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/test/*Test.{js,ts,tsx}"],
  notify: true,
  collectCoverage: true,
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
};
