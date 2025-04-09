import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    'test/(.*)': '<rootDir>/test/$1',
  },
  globalSetup: './test/utils/setup.ts',
  globalTeardown: './test/utils/teardown.ts',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  // setupFiles: ['./test/configs/utils/setupMock.ts'],
};

export default config;
