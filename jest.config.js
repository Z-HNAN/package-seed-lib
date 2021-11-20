/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/tests/.*\\.test\\.ts)$',
  coverageProvider: 'v8',
  globals: {
    'ts-jest': {
      tsconfig: './tests/tsconfig.json'
    }
  }
}