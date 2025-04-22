import { SQSClient, DeleteQueueCommand } from '@aws-sdk/client-sqs';

/**
 * Deletes an SQS Queue by its ARN.
 *
 * @param arn - The ARN of the SQS Queue to delete.
 */
export const deleteSQSQueue = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new SQSClient({ region });

  const queueUrl = arn.split('/').pop();
  if (!queueUrl) {
    return;
  }

  try {
    const command = new DeleteQueueCommand({ QueueUrl: queueUrl });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete SQS Queue with URL: ${queueUrl}`, error);
  }
};
