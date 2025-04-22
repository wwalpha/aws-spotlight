import { CloudFormationClient, DeleteStackCommand } from '@aws-sdk/client-cloudformation';

/**
 * Deletes a CloudFormation stack by its ARN.
 *
 * @param arn - The ARN of the CloudFormation stack to delete.
 */
export const deleteCloudFormationStack = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new CloudFormationClient({ region });

  const stackName = arn.split('/').pop();
  if (!stackName) {
    return;
  }

  try {
    const command = new DeleteStackCommand({ StackName: stackName });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete CloudFormation stack with stackName: ${stackName}`, error);
  }
};
