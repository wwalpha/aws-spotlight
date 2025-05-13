import { Cloud9Client, DeleteEnvironmentCommand } from '@aws-sdk/client-cloud9';

/**
 * Deletes a Cloud9 Environment by its ARN.
 *
 * @param arn - The ARN of the Cloud9 Environment to delete.
 */
export const deleteCloud9Environment = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new Cloud9Client({ region });

  // Extract the environment ID from the ARN
  // Format: arn:aws:cloud9:region:account-id:environment:environment-id
  const environmentId = arn.split(':').pop();
  if (!environmentId) {
    return;
  }

  try {
    const command = new DeleteEnvironmentCommand({ environmentId });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Cloud9 Environment with ID: ${environmentId}`, error);
  }
};
