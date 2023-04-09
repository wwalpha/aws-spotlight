import { SQSRecord } from 'aws-lambda';
import { DynamoDB, SNS, SQS } from 'aws-sdk';
import { defaultTo } from 'lodash';
import winston from 'winston';
import { CloudTrail, EVENT_TYPE, Tables } from 'typings';
import { Consts } from '.';

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

export const getUnprocessedItem = (record: CloudTrail.Record, arn: string): Tables.TUnprocessed => ({
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
export const removeIgnore = (records: CloudTrail.Record[], events: EVENT_TYPE) =>
  records.filter((item) => {
    const service = item.eventSource.split('.')[0].toUpperCase();
    const event = events[`${service}_${item.eventName}`];

    if (event === undefined) {
      return true;
    }

    if (event.EventSource === item.eventSource) {
      return !(event.Ignore === true);
    }

    return true;
  });

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
