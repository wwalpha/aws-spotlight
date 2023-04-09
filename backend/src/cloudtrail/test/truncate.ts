import { DynamodbHelper } from '@alphax/dynamodb';

const TABLE_NAME_UNPROCESSED = process.env.TABLE_NAME_UNPROCESSED as string;
const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;
const TABLE_NAME_HISTORY = process.env.TABLE_NAME_HISTORY as string;
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

const helper = new DynamodbHelper();

const start = async () => {
  await Promise.all([
    (helper.truncateAll(TABLE_NAME_UNPROCESSED),
    helper.truncateAll(TABLE_NAME_RESOURCES),
    helper.truncateAll(TABLE_NAME_HISTORY),
    helper.truncateAll(TABLE_NAME_EVENT_TYPE)),
  ]);
};

start();
