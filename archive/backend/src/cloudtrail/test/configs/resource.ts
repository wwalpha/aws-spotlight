// import { DynamodbHelper } from '@alphax/dynamodb';
// import { getCreateResourceItem } from '@src/apps/utils/events';
// import * as CreateEvents from '@test/datas/create';

// const helper = new DynamodbHelper();
// const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

// const start = async () => {
//   const keys = Object.keys(CreateEvents);

//   const rows = keys
//     .map((key) => getCreateResourceItem((CreateEvents as Record<string, any>)[key]))
//     .filter((item): item is Exclude<typeof item, undefined> => item !== undefined)
//     .reduce((prev, curr) => [...prev, ...curr], [] as Record<string, any>[]);

//   await helper.bulk(TABLE_NAME_EVENT_TYPE, rows);
// };

// start();
