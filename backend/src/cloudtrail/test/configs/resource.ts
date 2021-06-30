import { DynamodbHelper } from '@alphax/dynamodb';
import { getCreateResourceItem } from '@src/apps/utils/events';
import * as CreateEvents from '@test/datas/create';

const helper = new DynamodbHelper();

const start = async () => {
  const keys = Object.keys(CreateEvents);

  const rows = keys
    .map((key) => getCreateResourceItem((CreateEvents as Record<string, any>)[key]))
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined)
    .reduce((prev, curr) => [...prev, ...curr], [] as Record<string, any>[]);

  await helper.bulk('arms-resources-719d6c', rows);
};

start();
