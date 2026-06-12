module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/unit-testing/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/playwright/'
  ]
}
