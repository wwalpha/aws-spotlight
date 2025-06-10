import { DynamodbHelper } from '@alphax/dynamodb';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3Handler } from 'aws-lambda';
import { parse } from 'csv-parse';
import { Tables } from 'typings';

const TABLE_NAME = process.env.TABLE_NAME as string;

const client = new S3Client({});
const helper = new DynamodbHelper();
const parser = parse({
  delimiter: ',',
  skipEmptyLines: true,
});

export const handler: S3Handler = async (event) => {
  // get the bucket and key
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  // create a command
  const cmd = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  // get the object
  const res = await client.send(cmd);

  // do something with the content
  const contents = await res.Body?.transformToString();

  // if the content is undefined, return
  if (contents === undefined) {
    throw new Error(`Cannot get file content. Bucket: ${bucket}, Key: ${key}`);
  }

  // parse the content
  const dataRows = contents
    .split('\n')
    .splice(0, 1)
    .map<Tables.TEvents>((item) => {
      const items = item.split(',');

      return {
        AccountId: items[11],
        AWSRegion: items[13],
        EventId: items[8],
        EventName: items[3],
        EventSource: items[2],
        EventTime: items[1],
        RequestParameters: items[6],
        ResponseElements: items[7],
        UserName: items[0],
      };
    });

  helper.bulk(TABLE_NAME, dataRows);
};
// 1  UserIdentity,
// 2  EventTime,
// 3  EventSource,
// 4  EventName,
// 5 SourceIPAddress,
// 6  RequestParameters,
// 7  ResponseElements,
// 8  RequestId,
// 9  EventId,
// 10  Resources,
// 11  EventType,
// 12 RecipientAccountId,
// 13  ServiceEventDetails,
// 14  region,
// 15  year,
// 16  month,
// 17  day
