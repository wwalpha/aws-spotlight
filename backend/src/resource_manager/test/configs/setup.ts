require('dotenv').config({ path: '.env.test' });

import { DynamodbHelper } from '@alphax/dynamodb';
import AWS from 'aws-sdk';
import RESOURCE_DATAS from '../datas/resources.json';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

const TABLE_NAME_RESOURCE = process.env.TABLE_NAME_RESOURCE as string;

const setup = async () => {
  console.log('jest setup start...');
  const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

  await Promise.all([
    helper
      .getClient()
      .createTable({
        TableName: TABLE_NAME_RESOURCE as string,
        BillingMode: 'PROVISIONED',
        ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 },
        KeySchema: [
          { AttributeName: 'ResourceId', KeyType: 'HASH' },
          { AttributeName: 'EventTime', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'ResourceId', AttributeType: 'S' },
          { AttributeName: 'EventTime', AttributeType: 'S' },
          { AttributeName: 'EventSource', AttributeType: 'S' },
          { AttributeName: 'UserName', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'gsiIdx1',
            KeySchema: [
              { AttributeName: 'EventSource', KeyType: 'HASH' },
              { AttributeName: 'ResourceId', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { WriteCapacityUnits: 100, ReadCapacityUnits: 100 },
          },
          {
            IndexName: 'gsiIdx2',
            KeySchema: [
              { AttributeName: 'UserName', KeyType: 'HASH' },
              { AttributeName: 'ResourceId', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { WriteCapacityUnits: 100, ReadCapacityUnits: 100 },
          },
        ],
      })
      .promise(),
  ]);

  await helper.bulk(TABLE_NAME_RESOURCE, RESOURCE_DATAS);

  console.log('jest setup end...');
};

export default setup;
