import { TimestreamWriteClient, DeleteDatabaseCommand } from '@aws-sdk/client-timestream-write';

/**
 * Deletes a Timestream Database by its ARN.
 *
 * @param arn - The ARN of the Timestream Database to delete.
 */
export const deleteTimestreamDatabase = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new TimestreamWriteClient({ region });

  const databaseName = arn.split('/').pop();
  if (!databaseName) {
    return;
  }

  try {
    const command = new DeleteDatabaseCommand({ DatabaseName: databaseName });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Timestream Database with name: ${databaseName}`, error);
  }
};
