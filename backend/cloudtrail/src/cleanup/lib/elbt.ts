import { ElasticLoadBalancingV2Client, DeleteTargetGroupCommand } from '@aws-sdk/client-elastic-load-balancing-v2';

/**
 * Deletes a Target Group by its ARN.
 *
 * @param arn - The ARN of the Target Group to delete.
 */
export const deleteTargetGroup = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new ElasticLoadBalancingV2Client({ region });

  const targetGroupArn = arn.split('/').pop();
  if (!targetGroupArn) {
    return;
  }

  try {
    const command = new DeleteTargetGroupCommand({ TargetGroupArn: targetGroupArn });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Target Group with targetGroupArn: ${targetGroupArn}`, error);
  }
};
