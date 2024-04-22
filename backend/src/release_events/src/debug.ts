import { DynamodbHelper } from '@alphax/dynamodb';

const helper = new DynamodbHelper();
const TABLE_NAME_EVENTS = process.env.TABLE_NAME_EVENTS as string;

const debug = async () => {
  await helper.truncateAll(TABLE_NAME_EVENTS);
};

debug();
