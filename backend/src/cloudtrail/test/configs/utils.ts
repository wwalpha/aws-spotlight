import { DynamodbHelper } from '@alphax/dynamodb';
import { SNSMessage, SQSEvent, SQSRecord } from 'aws-lambda';
// import AWS, { S3, SQS } from 'aws-sdk';
import { PurgeQueueCommand, ReceiveMessageCommand, SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import zlib from 'zlib';
import { Tables } from 'typings';

// AWS.config.update({
//   region: process.env.AWS_REGION,
//   s3: { endpoint: process.env.AWS_ENDPOINT },
//   sqs: { endpoint: process.env.AWS_ENDPOINT },
//   dynamodb: { endpoint: process.env.AWS_ENDPOINT },
// });

const S3_BUCKET = process.env.S3_BUCKET as string;
const SQS_URL = process.env.SQS_URL as string;
const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;
const TABLE_NAME_HISTORY = process.env.TABLE_NAME_HISTORY as string;
const TABLE_NAME_UNPROCESSED = process.env.TABLE_NAME_UNPROCESSED as string;
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

const sqsClient = new SQSClient();
const s3Client = new S3Client();
const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

export const trancateAll = async () => {
  await Promise.all([
    helper.truncateAll(TABLE_NAME_RESOURCES),
    helper.truncateAll(TABLE_NAME_HISTORY),
    helper.truncateAll(TABLE_NAME_UNPROCESSED),
  ]);
};

export const receiveMessage = async () =>
  await sqsClient.send(
    new ReceiveMessageCommand({
      QueueUrl: SQS_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 1,
    })
  );

export const receiveMessageData = async (): Promise<SQSEvent> => {
  const result = await sqsClient.send(
    new ReceiveMessageCommand({
      QueueUrl: SQS_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 10,
    })
  );

  const ret = (result.Messages ||= []).map<SQSRecord>((item) => ({
    messageId: item.MessageId as string,
    messageAttributes: item.MessageAttributes as any,
    receiptHandle: item.ReceiptHandle as string,
    body: item.Body as string,
    attributes: item.Attributes as any,
    awsRegion: 'us-east-1',
    eventSource: 'sqs.amazonaws.com',
    eventSourceARN: 'arn',
    md5OfBody: item.MD5OfBody as string,
  }));

  return {
    Records: ret,
  };
};

export const sendMessageOnly = async (body: Record<string, any>[]) => {
  const key = `test/${getRandom()}.json.gz`;

  console.log('sendMessageOnly', key);

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: zlib.gzipSync(JSON.stringify({ Records: body })),
        ContentType: 'application/gz',
      })
    );

    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: SQS_URL,
        MessageBody: JSON.stringify({
          Message: JSON.stringify({ s3Bucket: S3_BUCKET, s3ObjectKey: [key] }),
        } as SNSMessage),
      })
    );
  } catch (err) {
    console.log(err);
  }
};

export const sendMessage = async (body: Record<string, any>): Promise<SQSEvent> => {
  await pureMessages();
  await sendMessageOnly([body]);

  const result = await sqsClient.send(
    new ReceiveMessageCommand({ QueueUrl: SQS_URL, MaxNumberOfMessages: 5, WaitTimeSeconds: 1 })
  );

  const messages = result.Messages;

  if (!messages || messages.length === 0) {
    throw new Error('Message not found');
  }

  if (messages.length > 1) {
    throw new Error('Multiple messages found');
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

export const pureMessages = async () => {
  await sqsClient.send(
    new PurgeQueueCommand({
      QueueUrl: SQS_URL,
    })
  );
};

export const getResource = async (ResourceId: string): Promise<Tables.TResource | undefined> => {
  const result = await helper.query<Tables.TResource>({
    TableName: TABLE_NAME_RESOURCES,
    KeyConditionExpression: 'ResourceId = :ResourceId',
    ExpressionAttributeValues: {
      ':ResourceId': ResourceId,
    },
  });

  return result?.Items[0];
};

export const getHistory = async (key: Tables.THistoryKey): Promise<Tables.THistory | undefined> => {
  const result = await helper.get<Tables.THistory>({
    TableName: TABLE_NAME_HISTORY,
    Key: {
      EventId: key.EventId,
    } as Tables.THistoryKey,
  });

  return result?.Item;
};

export const registUnprocessed = async (item: Tables.TUnprocessed): Promise<void> => {
  await helper.put<Tables.TUnprocessed>({
    TableName: TABLE_NAME_UNPROCESSED,
    Item: item,
  });
};

export const getUnprocessed = async (key: Tables.TUnprocessedKey): Promise<Tables.TUnprocessed | undefined> => {
  const result = await helper.get<Tables.TUnprocessed>({
    TableName: TABLE_NAME_UNPROCESSED,
    Key: key,
  });

  return result?.Item;
};

export const updateEventType = async (eventSource: string, eventName: string, action: string): Promise<void> => {
  await helper.update({
    TableName: TABLE_NAME_EVENT_TYPE,
    Key: { EventSource: eventSource, EventName: eventName } as Tables.TEventTypeKey,
    UpdateExpression: 'REMOVE #Unconfirmed, #Ignore',
    ExpressionAttributeNames: {
      '#Unconfirmed': 'Unconfirmed',
      '#Ignore': 'Ignore',
    },
  });

  await helper.update({
    TableName: TABLE_NAME_EVENT_TYPE,
    Key: { EventSource: eventSource, EventName: eventName } as Tables.TEventTypeKey,
    UpdateExpression: 'SET #Action = :action',
    ExpressionAttributeNames: {
      '#Action': action,
    },
    ExpressionAttributeValues: {
      ':action': true,
    },
  });
};

export const scanHistory = async (): Promise<Tables.THistory[] | undefined> => {
  const result = await helper.scan<Tables.THistory>({
    TableName: TABLE_NAME_HISTORY,
  });

  return result?.Items;
};

export const scanResource = async (): Promise<Tables.TResource[] | undefined> => {
  const result = await helper.scan<Tables.TResource>({
    TableName: TABLE_NAME_RESOURCES,
  });

  return result?.Items;
};

export const scanUnprocessed = async (): Promise<Tables.TUnprocessed[] | undefined> => {
  const result = await helper.scan<Tables.TUnprocessed>({
    TableName: TABLE_NAME_UNPROCESSED,
  });

  return result?.Items;
};

const getRandom = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
