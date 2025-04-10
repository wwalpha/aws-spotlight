import { DynamodbHelper } from '@alphax/dynamodb';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import { Parser } from 'json2csv';
import { Tables } from 'typings';

const S3_BUCKET_MATERIALS = process.env.S3_BUCKET_MATERIALS as string;
const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;
const TABLE_NAME_UNPROCESSED = process.env.TABLE_NAME_UNPROCESSED as string;
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

const s3Client = new S3Client();
const helper = new DynamodbHelper();

export const trancateAll = async () => {
  await Promise.all([helper.truncateAll(TABLE_NAME_RESOURCES), helper.truncateAll(TABLE_NAME_UNPROCESSED)]);
};

export const sendMessage = async (record: Record<string, any>): Promise<S3Event> => {
  record.userName =
    record.userIdentity?.userName || record.userIdentity?.sessionContext.sessionIssuer.userName || 'unknown';
  record.requestId = record.requestID;
  record.eventId = record.eventID;

  delete record.userIdentity;
  delete record.requestID;
  delete record.eventID;

  const parser = new Parser({
    fields: [
      'userName',
      'eventTime',
      'eventSource',
      'eventName',
      'awsRegion',
      'sourceIPAddress',
      'userAgent',
      'requestParameters',
      'responseElements',
      'additionalEventData',
      'requestId',
      'eventId',
      'resources',
      'recipientAccountId',
      'serviceEventDetails',
      'sharedEventId',
    ],
  });

  const contents = parser.parse(record);

  const key = `${getRandom()}.csv`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET_MATERIALS,
      Key: key,
      Body: contents,
      ContentType: 'text/csv',
    })
  );

  return {
    Records: [
      {
        s3: {
          bucket: {
            name: S3_BUCKET_MATERIALS,
            arn: `arn:aws:s3:::${S3_BUCKET_MATERIALS}`,
            ownerIdentity: {
              principalId: 'dummy-principal-id',
            },
          },
          object: {
            key: key,
            size: 1,
            eTag: 'dummy-etag',
            sequencer: 'dummy-sequencer',
          },
          configurationId: 'dummy-configuration-id',
          s3SchemaVersion: '1.0',
        },
        eventSource: 'aws:s3',
        eventName: 'PutObject',
        eventTime: new Date().toISOString(),
        eventVersion: '2.1',
        awsRegion: 'us-east-1',
        requestParameters: {} as any,
        responseElements: {} as any,
        userIdentity: {} as any,
      },
    ],
  };
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

// export const getHistory = async (key: Tables.THistoryKey): Promise<Tables.THistory | undefined> => {
//   const result = await helper.get<Tables.THistory>({
//     TableName: TABLE_NAME_HISTORY,
//     Key: {
//       ResourceId: key.ResourceId,
//       EventTime: key.EventTime,
//     } as Tables.THistoryKey,
//   });

//   return result?.Item;
// };

// export const registUnprocessed = async (item: Tables.TUnprocessed): Promise<void> => {
//   await helper.put<Tables.TUnprocessed>({
//     TableName: TABLE_NAME_UNPROCESSED,
//     Item: item,
//   });
// };

// export const getUnprocessed = async (key: Tables.TUnprocessedKey): Promise<Tables.TUnprocessed | undefined> => {
//   const result = await helper.get<Tables.TUnprocessed>({
//     TableName: TABLE_NAME_UNPROCESSED,
//     Key: key,
//   });

//   return result?.Item;
// };

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

// export const scanHistory = async (): Promise<Tables.THistory[] | undefined> => {
//   const result = await helper.scan<Tables.THistory>({
//     TableName: TABLE_NAME_HISTORY,
//   });

//   return result?.Items;
// };

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
