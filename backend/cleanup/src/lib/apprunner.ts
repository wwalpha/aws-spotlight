import { AppRunnerClient, DeleteServiceCommand } from '@aws-sdk/client-apprunner';

/**
 * Deletes an App Runner service by its ARN.
 *
 * @param arn - The ARN of the App Runner service to delete.
 */
export const deleteAppRunnerService = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new AppRunnerClient({ region });

  const serviceArn = arn.split('/').pop();
  if (!serviceArn) {
    return;
  }

  try {
    const command = new DeleteServiceCommand({ ServiceArn: serviceArn });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete App Runner service with serviceArn: ${serviceArn}`, error);
  }
};
