import { SQSRecord } from 'aws-lambda';
import { DynamoDB, SNS, SQS } from 'aws-sdk';
import { defaultTo, omit, uniqBy } from 'lodash';
import winston from 'winston';
import { CloudTrail, EVENT_TYPE, Tables } from 'typings';
import { Consts, DynamodbHelper, Utilities } from '.';

const sqsClient = new SQS();
const snsClient = new SNS();
const SQS_URL = process.env.SQS_URL as string;

export const LoggerOptions: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
};

export const Logger = winston.createLogger(LoggerOptions);

/**
 * Get ignore record
 *
 * @param record
 * @returns
 */
export const getIgnoreItem = (record: CloudTrail.Record): Tables.TIgnore => ({
  EventId: record.eventID,
  EventName: record.eventName,
  EventSource: record.eventSource,
  AWSRegion: record.awsRegion,
  EventTime: record.eventTime,
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  Raw: JSON.stringify(record),
});

/**
 * Get history record
 *
 * @param record
 * @returns
 */
export const getHistoryItem = (record: CloudTrail.Record): Tables.THistory => ({
  EventId: record.eventID,
  EventName: record.eventName,
  EventSource: record.eventSource,
  AWSRegion: record.awsRegion,
  EventTime: record.eventTime,
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  Origin: JSON.stringify(record),
});

export const getUnprocessedItem = (record: CloudTrail.Record, arn: string | string[]): Tables.TUnprocessed => ({
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: `${record.eventTime}_${record.eventID.substring(0, 8)}`,
  EventId: record.eventID,
  Raw: JSON.stringify(record),
  ResourceId: arn,
});

export const getRemoveUnprocessed = (record: CloudTrail.Record): Tables.TUnprocessedKey => ({
  EventName: record.eventName,
  EventTime: `${record.eventTime}_${record.eventID.substring(0, 8)}`,
});

export const getPutRecord = (tableName: string, item: any): DynamoDB.DocumentClient.TransactWriteItem => ({
  Put: {
    TableName: tableName,
    Item: item,
  },
});

export const getDeleteRecord = (
  tableName: string,
  key: DynamoDB.DocumentClient.Key
): DynamoDB.DocumentClient.TransactWriteItem => ({
  Delete: {
    TableName: tableName,
    Key: key,
  },
});

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
export const deleteSQSMessage = async (message: SQSRecord) => {
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
export const removeIgnore = async (records: CloudTrail.Record[], events: EVENT_TYPE) => {
  const ignoreRecords = records.filter((item) => {
    const service = item.eventSource.split('.')[0].toUpperCase();
    const event = events[`${service}_${item.eventName}`];

    // 未定義のイベントは無視する
    if (event === undefined) {
      return false;
    }

    // 同じリソース
    if (event.EventSource !== item.eventSource) {
      return false;
    }

    // 同じイベント
    if (event.EventName !== item.eventName) {
      return false;
    }

    return event.Ignore === true;
  });

  const ignoreRegists = ignoreRecords.map((item) => Utilities.getIgnoreItem(item));

  const uniqIgnores = uniqBy(ignoreRegists, 'EventId');

  // 一括登録
  await DynamodbHelper.bulk(Consts.Environments.TABLE_NAME_IGNORES, uniqIgnores);

  return records.filter((item) => {
    const service = item.eventSource.split('.')[0].toUpperCase();
    const event = events[`${service}_${item.eventName}`];

    // 未定義のイベントは無視する
    if (event === undefined) {
      return false;
    }

    // 同じリソース
    if (event.EventSource !== item.eventSource) {
      return true;
    }

    // 同じイベント
    if (event.EventName !== item.eventName) {
      return true;
    }

    return event.Ignore !== true;
  });
};

export const sendMail = async (subject: string, message: string) => {
  console.log(subject, message);
  try {
    await snsClient
      .publish({
        TopicArn: Consts.Environments.SNS_TOPIC_ARN,
        Subject: subject,
        Message: message,
      })
      .promise();
  } catch (err) {
    Logger.error(err);
  }
};

export const checkMultipleOperations = (items: DynamoDB.TransactWriteItem[]) => {
  console.log('checkMultipleOperations', items.length);

  items.forEach((item) => {
    if (item.Put) {
      console.log('PUT', item.Put.TableName, omit(item.Put.Item, ['Raw', 'Origin']));
    }
    if (item.Delete) {
      console.log('DELETE', item.Delete.TableName, item.Delete.Key);
    }
  });
};
