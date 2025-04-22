import { ECSClient, DeleteClusterCommand } from '@aws-sdk/client-ecs';

/**
 * Deletes an ECS cluster by its ARN.
 *
 * @param arn - The ARN of the ECS cluster to delete.
 */
export const deleteECSCluster = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new ECSClient({ region });

  const clusterName = arn.split('/').pop();
  if (!clusterName) {
    return;
  }

  try {
    const command = new DeleteClusterCommand({ cluster: clusterName });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete ECS cluster with clusterName: ${clusterName}`, error);
  }
};
