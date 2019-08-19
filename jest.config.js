// Jest config
// See https://facebook.github.io/jest/docs/en/configuration.html
module.exports = {
  testMatch: ["<rootDir>/test/*Test.js"],
  notify: true,
  //  verbose: false, // fix https://github.com/facebook/jest/issues/2441
  //  setupFiles: ['<rootDir>/test/jest-utils.js'],
  testURL: "https://example.com/foo"
};
