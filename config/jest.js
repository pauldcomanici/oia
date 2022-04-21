const jestConfig = {
  automock: false,
  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/node_modules/**',
    '!**/src/index.js',
    '!**/__fixtures__/**',
    '!**/__mocks__/**',
    '!**/__tests__/**',
    '!**/__snapshots__/**',
  ],
  coverageDirectory: '<rootDir>/coverage/',
  coverageReporters: [
    'lcov',
    'text',
  ],
  coverageThreshold: {
    'global': {
      'branches': 100,
      'functions': 100,
      'lines': 100,
      'statements': 100,
    },
  },
  rootDir: './../',
  testRegex: '/__tests__/.*\\.test\\.js$',
  verbose: false,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};

export default jestConfig;
