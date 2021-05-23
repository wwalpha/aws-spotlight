require('dotenv').config({ path: '.env.test' });

import { DynamodbHelper } from '@alphax/dynamodb';
import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

const TABLE_RESOURCE = process.env.TABLE_RESOURCE as string;

const setup = async () => {
  const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

  await Promise.all([
    helper
      .getClient()
      .createTable({
        TableName: process.env.TABLE_RESOURCE as string,
        BillingMode: 'PROVISIONED',
        ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 },
        KeySchema: [
          { AttributeName: 'EventSource', KeyType: 'HASH' },
          { AttributeName: 'ResourceId', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'EventSource', AttributeType: 'S' },
          { AttributeName: 'ResourceId', AttributeType: 'S' },
          { AttributeName: 'UserName', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'gsiIdx1',
            KeySchema: [
              { AttributeName: 'UserName', KeyType: 'HASH' },
              { AttributeName: 'EventSource', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { WriteCapacityUnits: 100, ReadCapacityUnits: 100 },
          },
        ],
      })
      .promise(),
  ]);

  // await helper.bulk(TABLE_RESOURCE, Events);
};

export default setup;
