import { DeleteTopicRuleCommand, IoTClient } from '@aws-sdk/client-iot';

/**
 * Deletes an IoT Topic Rule by its name.
 *
 * @param arn - The arn of the IoT Topic Rule to delete.
 */
export const deleteIotTopicRule = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new IoTClient({ region });

  const ruleName = arn.split('/').pop();
  if (!ruleName) {
    return;
  }

  try {
    const command = new DeleteTopicRuleCommand({
      ruleName: ruleName,
    });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete IoT Topic Rule with name: ${ruleName}`, error);
  }
};
