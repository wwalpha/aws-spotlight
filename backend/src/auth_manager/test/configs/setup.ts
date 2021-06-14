require('dotenv').config({ path: '.env.test' });

import { DynamodbHelper } from '@alphax/dynamodb';
import AWS from 'aws-sdk';
import Releases from './releases.json';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

const TABLE_NAME_SETTINGS = process.env.TABLE_NAME_SETTINGS as string;

const setup = async () => {
  const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

  //create table
  await helper
    .getClient()
    .createTable({
      TableName: TABLE_NAME_SETTINGS as string,
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 },
      KeySchema: [{ AttributeName: 'Id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'Id', AttributeType: 'S' }],
    })
    .promise();

  // insert data
  await helper.bulk(TABLE_NAME_SETTINGS, [Releases]);
};

export default setup;
