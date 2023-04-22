export * as Consts from './consts';
export * as Events from './events';
export { ResourceARNs } from './awsArns';
export * as Utilities from './utilities';
export { default as AddTags } from './addTags';
export { Logger } from './utilities';

import { DynamodbHelper as Helper } from '@alphax/dynamodb';
import { LoggerOptions } from './utilities';

export const DynamodbHelper = new Helper({
  options: { endpoint: process.env.AWS_ENDPOINT },
  logger: LoggerOptions,
});
