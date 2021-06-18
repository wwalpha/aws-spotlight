import { DynamodbHelper } from '@alphax/dynamodb';
import { SQSRecord } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import { defaultTo } from 'lodash';
import winston from 'winston';
import { Environments } from './consts';
import { CloudTrail, EVENT_TYPE, Tables } from 'typings';

const sqsClient = new SQS();
const SQS_URL = process.env.SQS_URL as string;
const helper = new DynamodbHelper();

export const Logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.simple()),
    }),
  ],
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
  await helper.bulk(Environments.TABLE_NAME_HISTORY, items);
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
