require('dotenv').config({ path: '.env.test' });

import AWS, { DynamoDB } from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

const TABLE_NAME_SETTINGS = process.env.TABLE_NAME_SETTINGS as string;
const dbClient = new DynamoDB();

const teardown = async () => {
  await dbClient.deleteTable({ TableName: TABLE_NAME_SETTINGS }).promise();
};

export default teardown;
