import winston from 'winston';
import { DynamodbHelper as Helper } from '@alphax/dynamodb';
import { defaultTo, orderBy } from 'lodash';
import { SNSMessage, SQSRecord } from 'aws-lambda';
import { gunzipSync } from 'node:zlib';
import { CloudTrail, Tables } from 'typings';

const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;
const TABLE_NAME_HISTORIES = process.env.TABLE_NAME_HISTORIES as string;

const options: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
};

export const DynamodbHelper = new Helper({ logger: options });
export const Logger = winston.createLogger(options);

/**
 * Get events record
 *
 * @param record
 * @returns
 */
const getHistoryItem = (record: Tables.TResource): Tables.THistory => ({
  ...record,
});

export const execute = async (key: Tables.TResourceKey) => {
  const dataRows = await DynamodbHelper.query<Tables.TResource>({
    TableName: TABLE_NAME_RESOURCES,
    KeyConditionExpression: '#ResourceId = :ResourceId and #EventTime LT :EventTime',
    ExpressionAttributeNames: {
      '#ResourceId': 'ResourceId',
      '#EventTime': 'EventTime',
    },
    ExpressionAttributeValues: {
      ':ResourceId': key.ResourceId,
      ':EventTime': key.EventTime,
    },
  });

  // no records
  if (dataRows.Items.length === 0) {
    return;
  }

  // add histories
  await DynamodbHelper.bulk(
    TABLE_NAME_HISTORIES,
    dataRows.Items.map((item) => getHistoryItem(item))
  );

  // remove resources
  await Promise.all(
    dataRows.Items.map((item) =>
      DynamodbHelper.delete({
        TableName: TABLE_NAME_RESOURCES,
        Key: {
          ResourceId: item.ResourceId,
          EventTime: item.EventTime,
        } as Tables.TResourceKey,
      })
    )
  );
};
