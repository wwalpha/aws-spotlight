import { AutoScalingClient, DeleteAutoScalingGroupCommand } from '@aws-sdk/client-auto-scaling';

/**
 * Deletes an Auto Scaling group by its ARN.
 *
 * @param arn - The ARN of the Auto Scaling group to delete.
 */
export const deleteAutoScalingGroup = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new AutoScalingClient({ region });

  const autoScalingGroupName = arn.split('/').pop();
  if (!autoScalingGroupName) {
    return;
  }

  try {
    const command = new DeleteAutoScalingGroupCommand({
      AutoScalingGroupName: autoScalingGroupName,
      ForceDelete: true,
    });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Auto Scaling group with autoScalingGroupName: ${autoScalingGroupName}`, error);
  }
};
