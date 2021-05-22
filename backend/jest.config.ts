import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@lambda/(.*)': '<rootDir>/src/lambda/$1',
  },
  setupFiles: ['dotenv/config'],
};

export default config;
