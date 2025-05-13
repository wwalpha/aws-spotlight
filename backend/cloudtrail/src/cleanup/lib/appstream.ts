import { AppStreamClient, DeleteFleetCommand } from '@aws-sdk/client-appstream';

/**
 * Deletes an AppStream Fleet by its ARN.
 *
 * @param arn - The ARN of the AppStream Fleet to delete.
 */
export const deleteAppStreamFleet = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new AppStreamClient({ region });

  // Extract the fleet name from the ARN
  const fleetName = arn.split('/').pop();
  if (!fleetName) {
    return;
  }

  try {
    const command = new DeleteFleetCommand({ Name: fleetName });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete AppStream Fleet with name: ${fleetName}`, error);
  }
};
