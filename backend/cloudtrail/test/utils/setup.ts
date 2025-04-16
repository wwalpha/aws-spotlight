require('dotenv').config({ path: '.env.dev' });

import { DynamodbHelper } from '@alphax/dynamodb';
import { start } from '../initialize/index';

const setup = async () => {
  console.log('jest setup start...');

  try {
    await start();
    const helper = new DynamodbHelper();

    await helper.truncateAll(process.env.TABLE_NAME_RESOURCES as string);
    await helper.truncateAll(process.env.TABLE_NAME_SETTINGS as string);
    await helper.truncateAll(process.env.TABLE_NAME_UNPROCESSED as string);

    console.log('jest setup end...');
  } catch (e) {
    console.error(e);
  }
};

export default setup;
