import {
  ElasticLoadBalancingV2Client,
  DeleteLoadBalancerCommand,
  DeleteTargetGroupCommand,
} from '@aws-sdk/client-elastic-load-balancing-v2';

/**
 * Deletes an Elastic Load Balancer by its ARN.
 *
 * @param arn - The ARN of the Elastic Load Balancer to delete.
 */
export const deleteLoadBalancer = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new ElasticLoadBalancingV2Client({ region });

  const loadBalancerArn = arn.split('/').pop();
  if (!loadBalancerArn) {
    return;
  }

  try {
    const command = new DeleteLoadBalancerCommand({ LoadBalancerArn: loadBalancerArn });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Elastic Load Balancer with loadBalancerArn: ${loadBalancerArn}`, error);
  }
};

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
