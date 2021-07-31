import { DynamodbHelper } from '@alphax/dynamodb';
import { S3, SQS, DynamoDB } from 'aws-sdk';
import zlib from 'zlib';
import { Tables } from 'typings';

const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;
const TABLE_NAME_HISTORY = process.env.TABLE_NAME_HISTORY as string;
const BUCKET_NAME_ARCHIVE = process.env.BUCKET_NAME_ARCHIVE as string;
const BUCKET_NAME_CLOUDTRAIL = process.env.BUCKET_NAME_CLOUDTRAIL as string;
const SQS_URL = process.env.SQS_URL as string;

const helper = new DynamodbHelper();
const s3Client = new S3();
const sqsClient = new SQS();

export const reCreate = async () => {
  // remove all record
  await helper.truncateAll(TABLE_NAME_RESOURCES);

  await reResource();
};

export const reCreateFromBucket = async () => {
  await postSQS();
};

const postSQS = async (token?: string) => {
  const results = await s3Client
    .listObjectsV2({
      Bucket: BUCKET_NAME_CLOUDTRAIL,
      Prefix: 'AWSLogs/99999999999/CloudTrail/',
      ContinuationToken: token,
    })
    .promise();

  if (!results.Contents) return [];

  const keys = results.Contents?.map((item) => item.Key).filter(
    (item): item is Exclude<typeof item, undefined> => item !== undefined
  );

  for (; keys.length > 0; ) {
    const items = keys.length > 100 ? keys.splice(0, 100) : keys.splice(0, keys.length);

    await sqsClient
      .sendMessage({
        QueueUrl: SQS_URL,
        MessageBody: JSON.stringify({
          Message: JSON.stringify({ s3Bucket: BUCKET_NAME_CLOUDTRAIL, s3ObjectKey: items }),
        }),
      })
      .promise();
  }

  console.log(results.NextContinuationToken);

  if (results.NextContinuationToken) {
    await postSQS(results.NextContinuationToken);
  }
};

const getBucketKeys = async (token?: string): Promise<string[]> => {
  const results = await s3Client
    .listObjectsV2({
      Bucket: BUCKET_NAME_CLOUDTRAIL,
      ContinuationToken: token,
    })
    .promise();

  if (!results.Contents) return [];

  const keys = results.Contents?.map((item) => item.Key).filter(
    (item): item is Exclude<typeof item, undefined> => item !== undefined
  );

  // hasNext
  if (results.NextContinuationToken) {
    const nextKeys = await getBucketKeys(results.NextContinuationToken);

    return [...keys, ...nextKeys];
  }

  return keys;
};

const reResource = async (lastEvaluatedKey?: DynamoDB.DocumentClient.Key) => {
  const results = await helper
    .scanRequest({
      TableName: TABLE_NAME_HISTORY,
      ExclusiveStartKey: lastEvaluatedKey,
    })
    .promise();

  const key = `patch/${getRandom()}.json.gz`;

  // no records
  if (!results.Items || results.Items.length === 0) {
    return;
  }

  const records = results.Items.map((item) => JSON.parse((item as Tables.History).Origin));

  await s3Client
    .putObject({
      Bucket: BUCKET_NAME_ARCHIVE,
      Key: key,
      Body: zlib.gzipSync(JSON.stringify({ Records: records })),
      ContentType: 'application/gz',
    })
    .promise();

  await sqsClient
    .sendMessage({
      QueueUrl: SQS_URL,
      MessageBody: JSON.stringify({
        Message: JSON.stringify({ s3Bucket: BUCKET_NAME_ARCHIVE, s3ObjectKey: [key] }),
      }),
    })
    .promise();

  if (results.LastEvaluatedKey) {
    await reResource(results.LastEvaluatedKey);
  }
};

const getRandom = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
