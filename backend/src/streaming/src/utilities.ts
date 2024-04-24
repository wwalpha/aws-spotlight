import winston from 'winston';
import { DynamodbHelper as Helper } from '@alphax/dynamodb';
import { TransactWriteItem } from '@aws-sdk/client-dynamodb';
import { chain, orderBy } from 'lodash';
import { Tables } from 'typings';

const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;
const TABLE_NAME_HISTORIES = process.env.TABLE_NAME_HISTORIES as string;

const options: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
};

export const DynamodbHelper = new Helper({ logger: options });
export const Logger = winston.createLogger(options);

export const execute = async (key: Tables.TResourceKey) => {
  const results = await DynamodbHelper.query<Tables.TResource>({
    TableName: TABLE_NAME_RESOURCES,
    KeyConditionExpression: '#ResourceId = :ResourceId',
    ExpressionAttributeNames: {
      '#ResourceId': 'ResourceId',
    },
    ExpressionAttributeValues: {
      ':ResourceId': key.ResourceId,
    },
    ConsistentRead: true,
  });

  const dataRows = results.Items;

  // no records
  if (dataRows.length === 0) {
    return;
  }

  const res = orderBy(dataRows, ['EventTime'], ['desc']);
  const lastestRes = res[0];
  const removed = dataRows.filter((item) => item.EventTime !== lastestRes.EventTime);

  // history transaction
  // const historyTransaction = removed.map<TransactWriteItem>((item) => ({
  //   Put: {
  //     TableName: TABLE_NAME_HISTORIES,
  //     Item: {
  //       ResourceId: { S: item.ResourceId },
  //       EventTime: { S: item.EventTime },
  //       ResourceName: { S: item.ResourceName as any },
  //       UserName: { S: item.UserName },
  //       EventSource: { S: item.EventSource },
  //       EventName: { S: item.EventName },
  //       EventId: { S: item.EventId },
  //       AWSRegion: { S: item.AWSRegion },
  //       Service: { S: item.Service },
  //       Status: { S: item.Status as any },
  //     },
  //   },
  // }));

  const items: TransactWriteItem[] = [];

  removed.forEach((item) => {
    items.push({
      Put: {
        TableName: TABLE_NAME_HISTORIES,
        Item: {
          ResourceId: { S: item.ResourceId },
          EventTime: { S: item.EventTime },
          ResourceName: { S: item.ResourceName as any },
          UserName: { S: item.UserName },
          EventSource: { S: item.EventSource },
          EventName: { S: item.EventName },
          EventId: { S: item.EventId },
          AWSRegion: { S: item.AWSRegion },
          Service: { S: item.Service },
          Status: { S: item.Status as any },
        },
      },
    });

    items.push({
      Delete: {
        TableName: TABLE_NAME_RESOURCES,
        Key: {
          ResourceId: { S: item.ResourceId },
          EventTime: { S: item.EventTime },
        },
      },
    });
  });

  await DynamodbHelper.getDocumentClient().transactWrite({
    TransactItems: items,
  });

  // transaction write
  // await DynamodbHelper.transactWrite({
  //   TransactItems: items,
  // });
};
