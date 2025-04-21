import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

require('dotenv').config({ path: '.env.test' });

const s3Client = new S3Client();

const teardown = async () => {
  console.log('jest teardown start...');

  console.log('jest teardown end...');
};

export const emptyBucket = async (bucketName: string, nextToken?: string): Promise<void> => {
  const results = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 1000,
      ContinuationToken: nextToken,
    })
  );

  if (!results.Contents || results.Contents.length === 0) {
    return;
  }

  const deleteParams = {
    Bucket: bucketName,
    Delete: {
      Objects: results.Contents.map((obj) => ({ Key: obj.Key })),
    },
  };

  // DeleteObjectsCommandを使用してオブジェクトを削除
  await s3Client.send(new DeleteObjectsCommand(deleteParams));

  // 再帰的に次のトークンを使用して続行
  await emptyBucket(bucketName, results.NextContinuationToken);
};

export default teardown;
