require('dotenv').config({ path: '.env.dev' });

import { DynamodbHelper } from '@alphax/dynamodb';
import * as fs from 'fs';
import * as path from 'path';
import { Tables } from 'typings';

const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

const getEvents = (): Tables.TEventType[] => {
  const texts = fs.readFileSync(path.join(__dirname, '../configs/events.csv')).toString();

  const lines = texts.split('\n').filter((item) => item !== '');

  return lines.map<Tables.TEventType>((item) => {
    const values = item.split(',');

    return {
      EventName: values[0],
      EventSource: values[1],
      Create: values[2] === 'create',
      Delete: values[2] === 'delete',
    };
  });
};

const setup = async () => {
  console.log('jest setup start...');

  try {
    const helper = new DynamodbHelper();
    await helper.truncateAll(TABLE_NAME_EVENT_TYPE);
    await helper.bulk(TABLE_NAME_EVENT_TYPE, getEvents());

    await helper.truncateAll(process.env.TABLE_NAME_RESOURCES as string);
    await helper.truncateAll(process.env.TABLE_NAME_SETTINGS as string);
    await helper.truncateAll(process.env.TABLE_NAME_UNPROCESSED as string);

    console.log('jest setup end...');
  } catch (e) {
    console.error(e);
  }
};

export default setup;
