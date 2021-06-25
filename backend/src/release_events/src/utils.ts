import { DynamodbHelper } from '@alphax/dynamodb';
import { S3, SQS, DynamoDB } from 'aws-sdk';
import zlib from 'zlib';
import { Tables } from 'typings';

const TABLE_NAME_RESOURCE = process.env.TABLE_NAME_RESOURCE as string;
const TABLE_NAME_HISTORY = process.env.TABLE_NAME_HISTORY as string;
const BUCKET_ARCHIVE = process.env.BUCKET_ARCHIVE as string;
const SQS_URL = process.env.SQS_URL as string;

const helper = new DynamodbHelper();
const s3Client = new S3();
const sqsClient = new SQS();

export const reCreate = async () => {
  // remove all record
  await helper.truncateAll(TABLE_NAME_RESOURCE);

  await reResource();
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
      Bucket: BUCKET_ARCHIVE,
      Key: key,
      Body: zlib.gzipSync(JSON.stringify({ Records: records })),
      ContentType: 'application/gz',
    })
    .promise();

  await sqsClient
    .sendMessage({
      QueueUrl: SQS_URL,
      MessageBody: JSON.stringify({
        Message: JSON.stringify({ s3Bucket: BUCKET_ARCHIVE, s3ObjectKey: [key] }),
      }),
    })
    .promise();

  if (results.LastEvaluatedKey) {
    await reResource(results.LastEvaluatedKey);
  }
};

const getRandom = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
