require('dotenv').config({ path: '.env.test' });

import { DynamoDB } from '@aws-sdk/client-dynamodb';

const dbClient = new DynamoDB({
  endpoint: process.env.AWS_ENDPOINT,
});

const teardown = async () => {
  console.log('jest teardown start...');

  await dbClient.deleteTable({ TableName: process.env.TABLE_NAME_RESOURCES as string });

  console.log('jest teardown end...');
};

export default teardown;
