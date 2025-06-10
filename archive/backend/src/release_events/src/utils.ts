import { DynamodbHelper } from '@alphax/dynamodb';
import { S3, SQS, DynamoDB } from 'aws-sdk';
import zlib from 'zlib';
import { Tables } from 'typings';
import _ from 'lodash';

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

  // await reResource();
};

export const reCreateFromBucket = async () => {
  console.log(process.env.SQS_URL);
  console.log(process.env.BUCKET_NAME_CLOUDTRAIL);

  await Promise.all([
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2022/04/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2022/05/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2022/06/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2022/07/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2022/08/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2022/09/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2022/10/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2022/11/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2022/12/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2023/01/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2023/02/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2023/03/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2023/04/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2023/05/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2023/06/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2023/07/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2023/08/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2023/09/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2023/10/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2023/11/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2023/12/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2024/01/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2024/02/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2024/03/'),
    postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/us-east-1/2024/04/'),
  ]);

  await Promise.all([
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2021/06/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2021/07/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2021/08/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2021/09/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2021/10/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2021/11/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2021/12/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2022/01/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2022/02/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2022/03/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2022/04/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2022/05/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2022/06/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2022/07/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2022/08/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2022/09/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2022/10/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2022/11/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2022/12/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2023/01/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2023/02/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2023/03/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2023/04/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2023/05/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2023/06/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2023/07/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2023/08/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2023/09/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2023/10/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2023/11/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2023/12/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2024/01/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2024/02/'),
    // postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2024/03/'),
    postSQS('cloudtrail-global/AWSLogs/334678299258/CloudTrail/ap-northeast-1/2024/04/'),
  ]);
};

const postSQS = async (s3Path: string, token?: string) => {
  const results = await s3Client
    .listObjectsV2({
      Bucket: BUCKET_NAME_CLOUDTRAIL,
      Prefix: s3Path,
      ContinuationToken: token,
    })
    .promise();

  if (!results.Contents) return [];

  const keys = results.Contents?.map((item) => item.Key).filter(
    (item): item is Exclude<typeof item, undefined> => item !== undefined
  );

  const tasks = _.chunk(keys, 10).map(async (items) =>
    sqsClient
      .sendMessage({
        QueueUrl: SQS_URL,
        MessageBody: JSON.stringify({
          Message: JSON.stringify({ s3Bucket: BUCKET_NAME_CLOUDTRAIL, s3ObjectKey: items }),
        }),
      })
      .promise()
  );

  await Promise.all(tasks);

  // await sleep(1000);

  console.log(results.NextContinuationToken);

  if (results.NextContinuationToken) {
    await postSQS(s3Path, results.NextContinuationToken);
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

// const reResource = async (lastEvaluatedKey?: DynamoDB.DocumentClient.Key) => {
//   const results = await helper.scan({
//     TableName: TABLE_NAME_HISTORY,
//     ExclusiveStartKey: lastEvaluatedKey,
//   });

//   const key = `patch/${getRandom()}.json.gz`;

//   // no records
//   if (!results.Items || results.Items.length === 0) {
//     return;
//   }

//   const records = results.Items.map((item) => JSON.parse((item as Tables.THistory).Origin));

//   await s3Client
//     .putObject({
//       Bucket: BUCKET_NAME_ARCHIVE,
//       Key: key,
//       Body: zlib.gzipSync(JSON.stringify({ Records: records })),
//       ContentType: 'application/gz',
//     })
//     .promise();

//   await sqsClient
//     .sendMessage({
//       QueueUrl: SQS_URL,
//       MessageBody: JSON.stringify({
//         Message: JSON.stringify({ s3Bucket: BUCKET_NAME_ARCHIVE, s3ObjectKey: [key] }),
//       }),
//     })
//     .promise();

//   if (results.LastEvaluatedKey) {
//     await reResource(results.LastEvaluatedKey);
//   }
// };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const getRandom = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

reCreateFromBucket();
