import jestConfig from './../../../config/jest.js';

const config = {
  ...jestConfig,
  rootDir: './../',
  setupFilesAfterEnv: [
    '<rootDir>/config/jest-setup.js',
  ],
};

export default config;
