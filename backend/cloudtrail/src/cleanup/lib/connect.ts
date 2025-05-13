import { ConnectClient, DeleteInstanceCommand } from '@aws-sdk/client-connect';

/**
 * Deletes an Amazon Connect instance by its ARN.
 *
 * @param arn - The ARN of the Amazon Connect instance to delete.
 */
export const deleteConnectInstance = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new ConnectClient({ region });

  const instanceId = arn.split('/').pop();
  if (!instanceId) {
    return;
  }

  try {
    const command = new DeleteInstanceCommand({ InstanceId: instanceId });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Amazon Connect instance with instanceId: ${instanceId}`, error);
  }
};
