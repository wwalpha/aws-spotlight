import winston from 'winston';
import { DynamodbHelper as Helper } from '@alphax/dynamodb';
import { defaultTo } from 'lodash';
import { SQSRecord } from 'aws-lambda';
import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { CloudTrail, EVENT_TYPE, Tables } from 'typings';

const options: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
};

export const DynamodbHelper = new Helper({ logger: options });
export const Logger = winston.createLogger(options);

const sqsClient = new SQSClient();
const SQS_URL = process.env.SQS_URL as string;
const EVENTS: EVENT_TYPE = {};
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

/**
 * Initialize Event Type Definition
 *
 * @returns
 */
export const initializeEvents = async () => {
  if (Object.keys(EVENTS).length !== 0) return EVENTS;

  // get all event definitions
  const results = await DynamodbHelper.scan<Tables.TEventType>({
    TableName: TABLE_NAME_EVENT_TYPE,
  });

  results.Items.forEach((item) => {
    const service = item.EventSource.split('.')[0].toUpperCase();
    EVENTS[`${service}_${item.EventName}`] = item;
  });

  return EVENTS;
};

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
  Origin: JSON.stringify(record),
});

/**
 * delete sqs message
 *
 * @param message
 */
export const deleteSQSMessage = async (message: SQSRecord) => {
  await sqsClient.send(
    new DeleteMessageCommand({
      QueueUrl: SQS_URL,
      ReceiptHandle: message.receiptHandle,
    })
  );
};

/**
 * remove ignore message record
 *
 * @param records
 * @returns
 */
export const removeIgnore = (dataRows: Tables.TRaw[]) => {
  return dataRows.filter((item) => {
    const record = JSON.parse(item.Origin) as CloudTrail.Record;
    const service = record.eventSource.split('.')[0].toUpperCase();
    const event = EVENTS[`${service}_${record.eventName}`];

    // TODO:未定義のイベントは無視する
    if (event === undefined) {
      return false;
    }

    // 同じリソース
    if (event.EventSource !== record.eventSource) {
      return true;
    }

    // 同じイベント
    if (event.EventName !== record.eventName) {
      return true;
    }

    return event.Ignore !== true;
  });
};
