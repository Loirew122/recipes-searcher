const { createDefaultEsmPreset } = require('ts-jest')

const esmPreset = createDefaultEsmPreset()

module.exports = {
  ...esmPreset,
  clearMocks: true,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
  },
}
