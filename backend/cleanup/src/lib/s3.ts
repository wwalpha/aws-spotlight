import { S3Client, DeleteBucketCommand } from '@aws-sdk/client-s3';

/**
 * Deletes an S3 Bucket by its ARN.
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
    const command = new DeleteBucketCommand({ Bucket: bucketName });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete S3 Bucket with name: ${bucketName}`, error);
  }
};
