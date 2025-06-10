import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import winston from 'winston';
import { DynamodbHelper as Helper } from '@alphax/dynamodb';
import { defaultTo, orderBy } from 'lodash';
import { SNSMessage, SQSRecord } from 'aws-lambda';
import { gunzipSync } from 'node:zlib';
import { CloudTrail, Tables } from 'typings';

const options: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
};

export const DynamodbHelper = new Helper({ logger: options });
export const Logger = winston.createLogger(options);

const sqsClient = new SQSClient();
const snsClient = new SNSClient();
const s3Client = new S3Client();
const SQS_URL_RAW = process.env.SQS_URL_RAW as string;
const TOPIC_ARN_EVENTS = process.env.TOPIC_ARN_EVENTS as string;

/**
 * Get events record
 *
 * @param record
 * @returns
 */
export const getEventsItem = (record: CloudTrail.Record): Tables.TRaw => ({
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

export const sendToSNS = async (ids: string[]) => {
  // send to SNS
  await snsClient.send(
    new PublishCommand({
      TopicArn: TOPIC_ARN_EVENTS,
      Message: ids.join(','),
    })
  );
};

/**
 * delete sqs message
 *
 * @param message
 */
export const deleteSQSMessage = async (message: SQSRecord) => {
  await sqsClient.send(
    new DeleteMessageCommand({
      QueueUrl: SQS_URL_RAW,
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
 * Get records from S3
 *
 * @param message
 * @returns
 */
export const getRecords = async (message: string): Promise<CloudTrail.Record[]> => {
  const snsMessage = JSON.parse(message) as SNSMessage;

  // skip validation message
  if (snsMessage.Message.startsWith('CloudTrail validation message')) {
    return [];
  }

  const payload = JSON.parse(snsMessage.Message) as CloudTrail.Payload;

  // get files
  const tasks = payload.s3ObjectKey.map((item) =>
    s3Client.send(
      new GetObjectCommand({
        Bucket: payload.s3Bucket,
        Key: item,
      })
    )
  );

  // get all files
  const files = await Promise.all(tasks);

  // unzip content
  const records = (
    await Promise.all(
      files.map(async (item) => {
        const content = await item.Body?.transformToByteArray();

        if (content === undefined) return undefined;

        //@ts-ignore
        return JSON.parse(gunzipSync(content)) as CloudTrail.Event;
      })
    )
  ).filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  Logger.debug('Records', records);

  // merge all records
  const newArray = records.reduce((prev, curr) => {
    return [...prev, ...curr.Records];
  }, [] as CloudTrail.Record[]);

  // 時間順
  return orderBy(newArray, ['eventTime'], ['asc']);
};
