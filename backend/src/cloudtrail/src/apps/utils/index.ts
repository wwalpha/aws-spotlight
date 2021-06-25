import { DynamodbHelper as Helper } from '@alphax/dynamodb';

export * as Consts from './consts';
export * as Events from './events';
export * as Utilities from './utilities';

export const DynamodbHelper = new Helper({ options: { endpoint: process.env.AWS_ENDPOINT } });
