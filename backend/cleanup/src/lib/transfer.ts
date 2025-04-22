import { TransferClient, DeleteServerCommand } from '@aws-sdk/client-transfer';

/**
 * Deletes a Transfer Server by its ARN.
 *
 * @param arn - The ARN of the Transfer Server to delete.
 */
export const deleteTransferServer = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new TransferClient({ region });

  const serverId = arn.split('/').pop();
  if (!serverId) {
    return;
  }

  try {
    const command = new DeleteServerCommand({ ServerId: serverId });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Transfer Server with serverId: ${serverId}`, error);
  }
};
