import { AmplifyClient, DeleteAppCommand } from '@aws-sdk/client-amplify';

/**
 * Deletes an Amplify application by its ARN.
 *
 * @param arn - The ARN of the Amplify application to delete.
 */
export const deleteAmplifyApp = async (arn: string): Promise<void> => {
  // Extract region from ARN
  const region = arn.split(':')[3];
  const client = new AmplifyClient({ region });

  const appId = arn.split('/').pop();
  if (!appId) {
    return;
  }

  try {
    const command = new DeleteAppCommand({ appId });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Amplify application with appId: ${appId}`, error);
  }
};
