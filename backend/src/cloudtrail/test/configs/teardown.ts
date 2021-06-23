require('dotenv').config({ path: '.env.test' });

import AWS, { DynamoDB, S3, SQS } from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

const S3_BUCKET = process.env.S3_BUCKET as string;
const s3Client = new S3();
const sqsClient = new SQS();
const dbClient = new DynamoDB();

const teardown = async () => {
  console.log('jest teardown start...');

  const objects = await listObject();

  // remove all objects
  await Promise.all(
    objects.map((item) => s3Client.deleteObject({ Bucket: S3_BUCKET, Key: item.Key as string }).promise())
  );

  // delete bucket
  await s3Client.deleteBucket({ Bucket: S3_BUCKET }).promise();

  // delete queue
  await sqsClient.deleteQueue({ QueueUrl: process.env.SQS_URL as string }).promise();

  await dbClient.deleteTable({ TableName: process.env.TABLE_NAME_EVENT_TYPE as string }).promise();
  await dbClient.deleteTable({ TableName: process.env.TABLE_NAME_RESOURCE as string }).promise();
  await dbClient.deleteTable({ TableName: process.env.TABLE_NAME_UNPROCESSED as string }).promise();
  await dbClient.deleteTable({ TableName: process.env.TABLE_NAME_HISTORY as string }).promise();

  console.log('jest teardown end...');
};

export const listObject = async (token?: string): Promise<S3.Object[]> => {
  const results = await s3Client
    .listObjectsV2({
      Bucket: S3_BUCKET,
      ContinuationToken: token,
    })
    .promise();

  if (results.NextContinuationToken) {
    const subList = await listObject(results.NextContinuationToken);

    return [...(results.Contents ??= []), ...subList];
  }

  return (results.Contents ??= []);
};

export default teardown;
