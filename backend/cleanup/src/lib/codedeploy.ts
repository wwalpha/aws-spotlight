import { CodeDeployClient, DeleteApplicationCommand } from '@aws-sdk/client-codedeploy';

/**
 * Deletes a CodeDeploy application by its ARN.
 *
 * @param arn - The ARN of the CodeDeploy application to delete.
 */
export const deleteCodeDeployApplication = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new CodeDeployClient({ region });

  const applicationName = arn.split('/').pop();
  if (!applicationName) {
    return;
  }

  try {
    const command = new DeleteApplicationCommand({ applicationName });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete CodeDeploy application with applicationName: ${applicationName}`, error);
  }
};
