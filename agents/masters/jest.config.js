module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '*.js',
    '!index.js',
    '!jest.config.js'
  ],
  verbose: true
};
