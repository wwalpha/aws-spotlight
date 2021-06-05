import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  globalSetup: './test/configs/setup.ts',
  globalTeardown: './test/configs/teardown.ts',
};

export default config;
