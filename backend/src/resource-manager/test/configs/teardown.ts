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
  await dbClient.deleteTable({ TableName: process.env.TABLE_RESOURCE as string }).promise();
};

export default teardown;
