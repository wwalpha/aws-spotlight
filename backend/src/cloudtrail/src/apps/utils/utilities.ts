import { SQSRecord } from 'aws-lambda';
import { defaultTo, omit } from 'lodash';
import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { TransactWriteItem } from '@aws-sdk/client-dynamodb';
import winston from 'winston';
import { CloudTrail, EVENT_TYPE, Tables } from 'typings';
import { Consts } from '.';

const sqsClient = new SQSClient();
const snsClient = new SNSClient();

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
export const getHistoryItem = (record: Tables.TEvents): Tables.THistory => ({
  EventId: record.EventId,
  EventName: record.EventName,
  EventSource: record.EventSource,
  AWSRegion: record.AWSRegion,
  EventTime: record.EventTime,
  UserName: record.UserName,
  Origin: JSON.stringify(record),
});

/**
 * Get events record
 *
 * @param record
 * @returns
 */
export const getEventsItem = (record: CloudTrail.Record): Tables.TEvents => ({
  EventId: record.eventID,
  EventName: record.eventName,
  EventSource: record.eventSource,
  AWSRegion: record.awsRegion,
  EventTime: record.eventTime,
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  RequestParameters: JSON.stringify(record.requestParameters),
  ResponseElements: record.responseElements !== undefined ? JSON.stringify(record.responseElements) : undefined,
  AccountId: record.recipientAccountId,
});

export const getUnprocessedItem = (record: Tables.TEvents, arn: string | string[]): Tables.TUnprocessed => ({
  EventName: record.EventName,
  EventSource: record.EventSource,
  EventTime: `${record.EventTime}_${record.EventId.substring(0, 8)}`,
  EventId: record.EventId,
  Raw: JSON.stringify(record),
  ResourceId: arn,
});

export const getRemoveUnprocessed = (record: Tables.TEvents): Tables.TUnprocessedKey => ({
  EventName: record.EventName,
  EventTime: `${record.EventTime}_${record.EventId.substring(0, 8)}`,
});

export const getPutRecord = (tableName: string, item: any): TransactWriteItem => ({
  Put: {
    TableName: tableName,
    Item: item,
  },
});

export const getDeleteRecord = (tableName: string, key: Record<string, any>): TransactWriteItem => ({
  Delete: {
    TableName: tableName,
    Key: key,
  },
});

/**
 * delete sqs message
 *
 * @param message
 */
export const deleteSQSMessage = async (url: string, message: SQSRecord) => {
  await sqsClient.send(
    new DeleteMessageCommand({
      QueueUrl: url,
      ReceiptHandle: message.receiptHandle,
    })
  );
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
export const removeIgnore = (records: CloudTrail.Record[], events: EVENT_TYPE) => {
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
    await snsClient.send(
      new PublishCommand({
        TopicArn: Consts.Environments.SNS_TOPIC_ARN,
        Subject: subject,
        Message: message,
      })
    );
  } catch (err) {
    Logger.error(err);
  }
};

export const checkMultipleOperations = (items: TransactWriteItem[]) => {
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
