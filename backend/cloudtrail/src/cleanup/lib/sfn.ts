import { SFNClient, DeleteStateMachineCommand } from '@aws-sdk/client-sfn';

/**
 * Deletes a Step Function State Machine by its ARN.
 *
 * @param arn - The ARN of the Step Function State Machine to delete.
 */
export const deleteStepFunctionStateMachine = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new SFNClient({ region });

  const stateMachineArn = arn.split(':').pop();
  if (!stateMachineArn) {
    return;
  }

  try {
    const command = new DeleteStateMachineCommand({ stateMachineArn });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Step Function State Machine with ARN: ${stateMachineArn}`, error);
  }
};
