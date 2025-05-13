import { SNSClient, DeleteTopicCommand } from '@aws-sdk/client-sns';

/**
 * Deletes an SNS Topic by its ARN.
 *
 * @param arn - The ARN of the SNS Topic to delete.
 */
export const deleteSNSTopic = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new SNSClient({ region });

  try {
    const command = new DeleteTopicCommand({ TopicArn: arn });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete SNS Topic with ARN: ${arn}`, error);
  }
};
