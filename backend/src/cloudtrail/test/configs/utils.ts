import { DynamodbHelper } from '@alphax/dynamodb';
import { SQSEvent } from 'aws-lambda';
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
const TABLE_RESOURCE = process.env.TABLE_RESOURCE as string;
const TABLE_HISTORY = process.env.TABLE_HISTORY as string;

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
    .sendMessage({ QueueUrl: SQS_URL, MessageBody: JSON.stringify({ s3Bucket: S3_BUCKET, s3ObjectKey: [key] }) })
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
        awsRegion: 'ap-northeast-1',
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
    TableName: TABLE_RESOURCE,
    Key: {
      EventSource,
      ResourceId,
    },
  });

  return result?.Item;
};

export const getHistory = async (key: Tables.HistoryKey): Promise<Tables.History | undefined> => {
  const result = await helper.get<Tables.History>({
    TableName: TABLE_HISTORY,
    Key: {
      EventId: key.EventId,
    } as Tables.HistoryKey,
  });

  return result?.Item;
};

export const scanHistory = async (): Promise<Tables.History[] | undefined> => {
  const result = await helper.scan<Tables.History>({
    TableName: TABLE_HISTORY,
  });

  return result?.Items;
};

const getRandom = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
