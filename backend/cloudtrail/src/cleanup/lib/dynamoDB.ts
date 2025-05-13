import { DynamoDBClient, DeleteTableCommand } from '@aws-sdk/client-dynamodb';

/**
 * Deletes a DynamoDB table by its ARN.
 *
 * @param arn - The ARN of the DynamoDB table to delete.
 */
export const deleteDynamoDBTable = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new DynamoDBClient({ region });

  const tableName = arn.split('/').pop();
  if (!tableName) {
    return;
  }

  try {
    const command = new DeleteTableCommand({ TableName: tableName });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete DynamoDB table with tableName: ${tableName}`, error);
  }
};
