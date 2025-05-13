import { GlobalAcceleratorClient, DeleteAcceleratorCommand } from '@aws-sdk/client-global-accelerator';

/**
 * Deletes a Global Accelerator by its ARN.
 *
 * @param arn - The ARN of the Global Accelerator to delete.
 */
export const deleteGlobalAccelerator = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new GlobalAcceleratorClient({ region });

  // Extract the accelerator ID from the ARN
  const acceleratorId = arn.split('/').pop();
  if (!acceleratorId) {
    return;
  }

  try {
    const command = new DeleteAcceleratorCommand({
      AcceleratorArn: arn,
    });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Global Accelerator with ID: ${acceleratorId}`, error);
  }
};
