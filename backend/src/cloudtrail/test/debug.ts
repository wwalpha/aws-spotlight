import { cloudtrail, unprocessed } from '@src/index';
import { DynamodbHelper } from '@alphax/dynamodb';
import { sendMessage } from './configs/utils';
import { start } from './configs/createEvents';
import CreateEvent from './datas/create/EC2_CreateSnapshots.json';

const helper = new DynamodbHelper();

const startU = async () => {
  // await helper.put({
  //   TableName: process.env.TABLE_UNPROCESSED as string,
  //   Item: {
  //     EventName: 'RunInstances',
  //     EventTime: '2021-04-07T15:53:12Z_ce2437c8',
  //     Raw: JSON.stringify(require('./RunInstances.json')),
  //   } as Tables.Unprocessed,
  // });

  await unprocessed();
};

const startC = async () => {
  const event = await sendMessage(CreateEvent);

  await cloudtrail(event);
};

const updateEvent = async () => {
  start();

  await helper.bulk(process.env.TABLE_EVENT_TYPE as string, require('./configs/events_all.json'));
};

startC();
// updateEvent();
