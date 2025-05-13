import { FirehoseClient, DeleteDeliveryStreamCommand } from '@aws-sdk/client-firehose';

/**
 * Deletes a Firehose Delivery Stream by its ARN.
 *
 * @param arn - The ARN of the Firehose Delivery Stream to delete.
 */
export const deleteFirehoseDeliveryStream = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new FirehoseClient({ region });

  const deliveryStreamName = arn.split('/').pop();
  if (!deliveryStreamName) {
    return;
  }

  try {
    const command = new DeleteDeliveryStreamCommand({ DeliveryStreamName: deliveryStreamName });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Firehose Delivery Stream with name: ${deliveryStreamName}`, error);
  }
};
