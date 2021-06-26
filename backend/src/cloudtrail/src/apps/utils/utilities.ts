import { SQSRecord } from 'aws-lambda';
import { DynamoDB, SQS } from 'aws-sdk';
import { defaultTo } from 'lodash';
import winston from 'winston';
import { Environments } from './consts';
import { CloudTrail, EVENT_TYPE, Tables } from 'typings';
import { DynamodbHelper } from '.';

const sqsClient = new SQS();
const SQS_URL = process.env.SQS_URL as string;

export const LoggerOptions: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'test.log' }),
  ],
};

export const Logger = winston.createLogger(LoggerOptions);

/**
 * Get history record
 *
 * @param record
 * @returns
 */
export const getHistoryItem = (record: CloudTrail.Record): Tables.History => ({
  EventId: record.eventID,
  EventName: record.eventName,
  EventSource: record.eventSource,
  AWSRegion: record.awsRegion,
  EventTime: record.eventTime,
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  Origin: JSON.stringify(record),
});

export const getPutRecord = (tableName: string, item: any): DynamoDB.DocumentClient.TransactWriteItem => ({
  Put: {
    TableName: tableName,
    Item: item,
  },
});

export const getDeleteRecord = (tableName: string, key: DynamoDB.DocumentClient.Key): DynamoDB.DocumentClient.TransactWriteItem => ({
  Delete: {
    TableName: tableName,
    Key: key,
  },
});

/**
 * Regist history
 *
 * @param records
 */
export const registHistory = async (records: CloudTrail.Record[]): Promise<void> => {
  const items = records.map<Tables.History>((item) => ({
    EventId: item.eventID,
    EventName: item.eventName,
    EventSource: item.eventSource,
    AWSRegion: item.awsRegion,
    EventTime: item.eventTime,
    UserName: defaultTo(item.userIdentity?.userName, item.userIdentity.sessionContext?.sessionIssuer?.userName),
    Origin: JSON.stringify(item),
  }));

  // bulk insert
  await DynamodbHelper.bulk(Environments.TABLE_NAME_HISTORY, items);
};

/**
 * Receive SQS Messages
 *
 * @returns
 */
export const getSQSMessages = async () => {
  const sqsResults = await sqsClient
    .receiveMessage({
      QueueUrl: SQS_URL,
      MaxNumberOfMessages: 10,
    })
    .promise();

  return (sqsResults.Messages ??= []);
};

/**
 * delete sqs message
 *
 * @param message
 */
export const deleteMessage = async (message: SQSRecord) => {
  await sqsClient
    .deleteMessage({
      QueueUrl: SQS_URL,
      ReceiptHandle: message.receiptHandle,
    })
    .promise();
};

/**
 * remove ReadOnly=true records
 *
 * @param records
 * @returns
 */
export const removeReadOnly = (records: CloudTrail.Record[]) => records.filter((item) => !(item.readOnly === true));

/**
 * remove error message record
 *
 * @param records
 * @returns
 */
export const removeError = (records: CloudTrail.Record[]) => records.filter((item) => !(item.errorCode !== undefined));

/**
 * remove ignore message record
 *
 * @param records
 * @returns
 */
export const removeIgnore = (records: CloudTrail.Record[], events: EVENT_TYPE) =>
  records.filter((item) => {
    const event = events[item.eventName];

    if (event === undefined) {
      return true;
    }

    if (event.EventSource === item.eventSource) {
      return !(event.Ignore === true);
    }

    return true;
  });
