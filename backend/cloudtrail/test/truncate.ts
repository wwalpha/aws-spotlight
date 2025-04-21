import { DynamodbHelper } from '@alphax/dynamodb';
import { ResourceService } from '@src/services';

const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

const start = async () => {
  const helper = new DynamodbHelper();

  for (;;) {
    try {
      await helper.truncateAll(TABLE_NAME_RESOURCES);
      break;
    } catch (e) {}
  }

  await helper.truncateAll(TABLE_NAME_EVENT_TYPE);
};

start();
