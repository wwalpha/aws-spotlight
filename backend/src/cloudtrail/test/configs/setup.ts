require('dotenv').config({ path: '.env.test' });

import { DynamodbHelper } from '@alphax/dynamodb';
import AWS, { S3, SQS } from 'aws-sdk';
import Events from './events.json';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

const setup = async () => {
  console.log('jest setup start...');

  const s3Client = new S3();
  const sqsClient = new SQS();
  const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

  await Promise.all([
    s3Client.createBucket({ Bucket: process.env.S3_BUCKET as string }).promise(),
    sqsClient.createQueue({ QueueName: process.env.SQS_QUEUE as string }).promise(),
    helper
      .getClient()
      .createTable({
        TableName: process.env.TABLE_NAME_EVENT_TYPE as string,
        BillingMode: 'PROVISIONED',
        ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 },
        KeySchema: [
          { AttributeName: 'EventName', KeyType: 'HASH' },
          { AttributeName: 'EventSource', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'EventName', AttributeType: 'S' },
          { AttributeName: 'EventSource', AttributeType: 'S' },
        ],
      })
      .promise(),
    helper
      .getClient()
      .createTable({
        TableName: process.env.TABLE_NAME_RESOURCE as string,
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
              { AttributeName: 'ResourceId', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { WriteCapacityUnits: 100, ReadCapacityUnits: 100 },
          },
        ],
      })
      .promise(),
    helper
      .getClient()
      .createTable({
        TableName: process.env.TABLE_NAME_UNPROCESSED as string,
        BillingMode: 'PROVISIONED',
        ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 },
        KeySchema: [
          { AttributeName: 'EventName', KeyType: 'HASH' },
          { AttributeName: 'EventTime', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'EventName', AttributeType: 'S' },
          { AttributeName: 'EventTime', AttributeType: 'S' },
        ],
      })
      .promise(),
    helper
      .getClient()
      .createTable({
        TableName: process.env.TABLE_NAME_HISTORY as string,
        BillingMode: 'PROVISIONED',
        ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 },
        KeySchema: [{ AttributeName: 'EventId', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'EventId', AttributeType: 'S' }],
      })
      .promise(),
  ]);

  await helper.bulk(TABLE_NAME_EVENT_TYPE, Events);

  console.log('jest setup end...');
};

// setup();

export default setup;
