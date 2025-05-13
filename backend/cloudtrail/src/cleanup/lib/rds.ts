import { RDSClient, DeleteDBInstanceCommand, DeleteDBClusterCommand } from '@aws-sdk/client-rds';

/**
 * Deletes an RDS DBInstance by its ARN.
 *
 * @param arn - The ARN of the RDS DBInstance to delete.
 */
export const deleteRDSDBInstance = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new RDSClient({ region });

  const dbInstanceIdentifier = arn.split(':').pop();
  if (!dbInstanceIdentifier) {
    return;
  }

  try {
    const command = new DeleteDBInstanceCommand({
      DBInstanceIdentifier: dbInstanceIdentifier,
      SkipFinalSnapshot: true,
    });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete RDS DBInstance with identifier: ${dbInstanceIdentifier}`, error);
  }
};

/**
 * Deletes an RDS DBCluster by its ARN.
 *
 * @param arn - The ARN of the RDS DBCluster to delete.
 */
export const deleteRDSDBCluster = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new RDSClient({ region });

  const dbClusterIdentifier = arn.split(':').pop();
  if (!dbClusterIdentifier) {
    return;
  }

  try {
    const command = new DeleteDBClusterCommand({
      DBClusterIdentifier: dbClusterIdentifier,
      SkipFinalSnapshot: true,
    });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete RDS DBCluster with identifier: ${dbClusterIdentifier}`, error);
  }
};
