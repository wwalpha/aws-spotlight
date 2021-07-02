import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    'test/(.*)': '<rootDir>/test/$1',
  },
  globalSetup: './test/configs/setup.ts',
  globalTeardown: './test/configs/teardown.ts',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  setupFiles: ['./test/configs/setupMock.ts'],
};

export default config;
