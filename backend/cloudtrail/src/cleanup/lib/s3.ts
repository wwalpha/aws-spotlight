import { S3Client, DeleteBucketCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

/**
 * Deletes all objects in an S3 Bucket.
 *
 * @param client - The S3 client instance.
 * @param bucketName - The name of the S3 Bucket.
 */
export const deleteAllObjectsInBucket = async (
  client: S3Client,
  bucketName: string,
  continuationToken?: string
): Promise<void> => {
  try {
    const listCommand = new ListObjectsV2Command({ Bucket: bucketName, ContinuationToken: continuationToken });
    const listResponse = await client.send(listCommand);

    if (listResponse.Contents && listResponse.Contents.length > 0) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: listResponse.Contents.map((object) => ({ Key: object.Key })),
        },
      });
      await client.send(deleteCommand);
    }

    if (listResponse.IsTruncated) {
      // If the response is truncated, call the function recursively with the new continuation token
      await deleteAllObjectsInBucket(client, bucketName, listResponse.NextContinuationToken);
    }
  } catch (error) {
    console.error(`Failed to delete objects in S3 Bucket: ${bucketName}`, error);
  }
};

/**
 * Deletes an S3 Bucket by its ARN.
 * Before deleting the bucket, all objects inside the bucket are deleted.
 *
 * @param arn - The ARN of the S3 Bucket to delete.
 */
export const deleteS3Bucket = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new S3Client({ region });

  const bucketName = arn.split(':').pop();
  if (!bucketName) {
    return;
  }

  try {
    // Delete all objects in the bucket
    await deleteAllObjectsInBucket(client, bucketName);

    // Delete the bucket
    const deleteBucketCommand = new DeleteBucketCommand({ Bucket: bucketName });
    await client.send(deleteBucketCommand);
  } catch (error) {
    console.error(`Failed to delete S3 Bucket with name: ${bucketName}`, error);
  }
};
