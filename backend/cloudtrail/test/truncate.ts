import { DynamodbHelper } from '@alphax/dynamodb';

const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;

const start = async () => {
  const helper = new DynamodbHelper();
  await helper.truncateAll(TABLE_NAME_RESOURCES);
};

start();
