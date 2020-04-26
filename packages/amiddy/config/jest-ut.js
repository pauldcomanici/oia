const jestConfig = require('./../../../config/jest');

module.exports = {
  ...jestConfig,
  rootDir: './../',
  setupFilesAfterEnv: [
    '<rootDir>/config/jest-setup.js',
  ],
};
