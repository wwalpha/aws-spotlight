require('dotenv').config({ path: '.env.test' });

import { DynamodbHelper } from '@alphax/dynamodb';
import RESOURCE_DATAS from '../datas/resources.json';

const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;

const setup = async () => {
  console.log('jest setup start...');
  const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

  await Promise.all([
    helper.getClient().createTable({
      TableName: TABLE_NAME_RESOURCES as string,
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
    }),
  ]);

  await helper.bulk(TABLE_NAME_RESOURCES, RESOURCE_DATAS);

  console.log('jest setup end...');
};

export default setup;
