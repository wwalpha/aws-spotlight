import { DynamodbHelper } from '@alphax/dynamodb';
import { SNSMessage, SQSEvent } from 'aws-lambda';
import AWS, { S3, SQS } from 'aws-sdk';
import zlib from 'zlib';
import { Tables } from 'typings';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

const S3_BUCKET = process.env.S3_BUCKET as string;
const SQS_URL = process.env.SQS_URL as string;
const TABLE_NAME_RESOURCE = process.env.TABLE_NAME_RESOURCE as string;
const TABLE_NAME_HISTORY = process.env.TABLE_NAME_HISTORY as string;
const TABLE_NAME_UNPROCESSED = process.env.TABLE_NAME_UNPROCESSED as string;
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

const sqsClient = new SQS();
const s3Client = new S3();
const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

export const sendMessage = async (body: Record<string, any>): Promise<SQSEvent> => {
  const key = `test/${getRandom()}.json.gz`;

  await s3Client
    .putObject({
      Bucket: S3_BUCKET,
      Key: key,
      Body: zlib.gzipSync(JSON.stringify({ Records: [body] })),
      ContentType: 'application/gz',
    })
    .promise();

  await sqsClient
    .sendMessage({
      QueueUrl: SQS_URL,
      MessageBody: JSON.stringify({
        Message: JSON.stringify({ s3Bucket: S3_BUCKET, s3ObjectKey: [key] }),
      } as SNSMessage),
    })
    .promise();

  const result = await sqsClient.receiveMessage({ QueueUrl: SQS_URL, MaxNumberOfMessages: 1 }).promise();

  const messages = result.Messages;

  if (!messages || messages.length === 0) {
    throw new Error();
  }

  return {
    Records: [
      {
        messageId: messages[0].MessageId as string,
        messageAttributes: messages[0].MessageAttributes as any,
        receiptHandle: messages[0].ReceiptHandle as string,
        body: messages[0].Body as string,
        attributes: messages[0].Attributes as any,
        awsRegion: 'us-east-1',
        eventSource: 'sqs.amazonaws.com',
        eventSourceARN: 'arn',
        md5OfBody: messages[0].MD5OfBody as string,
      },
    ],
  };
};

export const getResource = async ({
  EventSource,
  ResourceId,
}: Tables.ResouceKey): Promise<Tables.Resource | undefined> => {
  const result = await helper.get<Tables.Resource>({
    TableName: TABLE_NAME_RESOURCE,
    Key: {
      EventSource,
      ResourceId,
    },
  });

  return result?.Item;
};

export const getHistory = async (key: Tables.HistoryKey): Promise<Tables.History | undefined> => {
  const result = await helper.get<Tables.History>({
    TableName: TABLE_NAME_HISTORY,
    Key: {
      EventId: key.EventId,
    } as Tables.HistoryKey,
  });

  return result?.Item;
};

export const getUnprocessed = async (key: Tables.UnprocessedKey): Promise<Tables.Unprocessed | undefined> => {
  const result = await helper.get<Tables.Unprocessed>({
    TableName: TABLE_NAME_UNPROCESSED,
    Key: key,
  });

  return result?.Item;
};

export const updateEventType = async (eventSource: string, eventName: string, action: string): Promise<void> => {
  await helper.update({
    TableName: TABLE_NAME_EVENT_TYPE,
    Key: { EventSource: eventSource, EventName: eventName } as Tables.EventTypeKey,
    UpdateExpression: 'REMOVE #Unconfirmed, #Ignore',
    ExpressionAttributeNames: {
      '#Unconfirmed': 'Unconfirmed',
      '#Ignore': 'Ignore',
    },
  });

  await helper.update({
    TableName: TABLE_NAME_EVENT_TYPE,
    Key: { EventSource: eventSource, EventName: eventName } as Tables.EventTypeKey,
    UpdateExpression: 'SET #Action = :action',
    ExpressionAttributeNames: {
      '#Action': action,
    },
    ExpressionAttributeValues: {
      ':action': true,
    },
  });
};

export const scanHistory = async (): Promise<Tables.History[] | undefined> => {
  const result = await helper.scan<Tables.History>({
    TableName: TABLE_NAME_HISTORY,
  });

  return result?.Items;
};

const getRandom = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
