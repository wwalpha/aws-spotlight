import winston from 'winston';
import { DynamodbHelper as Helper } from '@alphax/dynamodb';
import { orderBy } from 'lodash';
import { Tables } from 'typings';
import { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

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

  // latest only
  if (removed.length === 0) {
    return;
  }

  const input: TransactWriteCommandInput = {
    TransactItems: [],
  };

  removed.forEach((item) => {
    input.TransactItems?.push({
      Put: {
        TableName: TABLE_NAME_HISTORIES,
        Item: { ...item },
      },
    });

    input.TransactItems?.push({
      Delete: {
        TableName: TABLE_NAME_RESOURCES,
        Key: {
          ResourceId: item.ResourceId,
          EventTime: item.EventTime,
        },
      },
    });
  });

  await DynamodbHelper.transactWrite(input);
};
