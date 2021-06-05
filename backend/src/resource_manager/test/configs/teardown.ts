require('dotenv').config({ path: '.env.test' });

import AWS, { DynamoDB } from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

const dbClient = new DynamoDB();

const teardown = async () => {
  console.log('jest teardown start...');

  await dbClient.deleteTable({ TableName: process.env.TABLE_NAME_RESOURCE as string }).promise();

  console.log('jest teardown end...');
};

export default teardown;
