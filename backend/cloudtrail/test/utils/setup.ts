require('dotenv').config({ path: '.env.test' });

import { DynamodbHelper } from '@alphax/dynamodb';
import { CreateBucketCommand, S3, S3Client } from '@aws-sdk/client-s3';
import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import * as fs from 'fs';
import * as path from 'path';
import { Tables } from 'typings';

const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;
const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;
const TABLE_NAME_SETTINGS = process.env.TABLE_NAME_SETTINGS as string;
const TABLE_NAME_UNPROCESSED = process.env.TABLE_NAME_UNPROCESSED as string;

const getEvents = (): Tables.TEventType[] => {
  const texts = fs.readFileSync(path.join(__dirname, '../configs/events.csv')).toString();

  const lines = texts.split('\n').filter((item) => item !== '');

  return lines.map<Tables.TEventType>((item) => {
    const values = item.split(',');

    return {
      EventName: values[0],
      EventSource: values[1],
      Create: values[2] === 'create',
      Delete: values[2] === 'delete',
    };
  });
};

const setup = async () => {
  console.log('jest setup start...');

  try {
    // const s3Client = new S3Client();
    // const dbClient = new DynamoDBClient();

    // await Promise.all([
    //   s3Client.send(new CreateBucketCommand({ Bucket: process.env.S3_BUCKET_MATERIALS as string })),
    //   dbClient.send(
    //     new CreateTableCommand({
    //       TableName: TABLE_NAME_RESOURCES as string,
    //       BillingMode: 'PAY_PER_REQUEST',
    //       KeySchema: [{ AttributeName: 'ResourceId', KeyType: 'HASH' }],
    //       AttributeDefinitions: [
    //         { AttributeName: 'ResourceId', AttributeType: 'S' },
    //         { AttributeName: 'EventSource', AttributeType: 'S' },
    //         { AttributeName: 'EventName', AttributeType: 'S' },
    //         { AttributeName: 'ResourceName', AttributeType: 'S' },
    //       ],
    //       GlobalSecondaryIndexes: [
    //         {
    //           IndexName: 'gsiIdx1',
    //           KeySchema: [
    //             { AttributeName: 'EventSource', KeyType: 'HASH' },
    //             { AttributeName: 'ResourceName', KeyType: 'RANGE' },
    //           ],
    //           Projection: { ProjectionType: 'ALL' },
    //         },
    //         {
    //           IndexName: 'gsiIdx2',
    //           KeySchema: [
    //             { AttributeName: 'EventSource', KeyType: 'HASH' },
    //             { AttributeName: 'EventName', KeyType: 'RANGE' },
    //           ],
    //           Projection: { ProjectionType: 'ALL' },
    //         },
    //       ],
    //     })
    //   ),
    //   dbClient.send(
    //     new CreateTableCommand({
    //       TableName: TABLE_NAME_EVENT_TYPE as string,
    //       BillingMode: 'PAY_PER_REQUEST',
    //       KeySchema: [
    //         { AttributeName: 'EventName', KeyType: 'HASH' },
    //         { AttributeName: 'EventSource', KeyType: 'RANGE' },
    //       ],
    //       AttributeDefinitions: [
    //         { AttributeName: 'EventName', AttributeType: 'S' },
    //         { AttributeName: 'EventSource', AttributeType: 'S' },
    //       ],
    //     })
    //   ),
    //   dbClient.send(
    //     new CreateTableCommand({
    //       TableName: TABLE_NAME_SETTINGS as string,
    //       BillingMode: 'PAY_PER_REQUEST',
    //       KeySchema: [{ AttributeName: 'Id', KeyType: 'HASH' }],
    //       AttributeDefinitions: [{ AttributeName: 'Id', AttributeType: 'S' }],
    //     })
    //   ),
    //   dbClient.send(
    //     new CreateTableCommand({
    //       TableName: TABLE_NAME_UNPROCESSED as string,
    //       BillingMode: 'PAY_PER_REQUEST',
    //       KeySchema: [
    //         { AttributeName: 'EventName', KeyType: 'HASH' },
    //         { AttributeName: 'EventTime', KeyType: 'RANGE' },
    //       ],
    //       AttributeDefinitions: [
    //         { AttributeName: 'EventName', AttributeType: 'S' },
    //         { AttributeName: 'EventTime', AttributeType: 'S' },
    //         { AttributeName: 'EventSource', AttributeType: 'S' },
    //       ],
    //       GlobalSecondaryIndexes: [
    //         {
    //           IndexName: 'gsiIdx1',
    //           KeySchema: [
    //             { AttributeName: 'EventSource', KeyType: 'HASH' },
    //             { AttributeName: 'EventName', KeyType: 'RANGE' },
    //           ],
    //           Projection: { ProjectionType: 'ALL' },
    //         },
    //       ],
    //     })
    //   ),
    // ]);

    // await sleep(10000);

    const helper = new DynamodbHelper();
    await helper.truncateAll(TABLE_NAME_EVENT_TYPE);
    await helper.bulk(TABLE_NAME_EVENT_TYPE, getEvents());

    await helper.truncateAll(process.env.TABLE_NAME_RESOURCES as string);
    await helper.truncateAll(process.env.TABLE_NAME_SETTINGS as string);
    await helper.truncateAll(process.env.TABLE_NAME_UNPROCESSED as string);

    console.log('jest setup end...');
  } catch (e) {
    console.error(e);
  }
};

// setup();
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default setup;
