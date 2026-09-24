export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/tests/transformers/jsx-transformer.js',
  },
  moduleNameMapper: {
    '\\.(scss|css)(\\?inline)?$': '<rootDir>/tests/__mocks__/styleMock.js',
    '^@core$': '<rootDir>/src/core/index.js',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
}
