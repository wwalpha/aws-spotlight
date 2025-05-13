import { DirectoryServiceClient, DeleteDirectoryCommand } from '@aws-sdk/client-directory-service';

/**
 * Deletes a Directory Service directory by its ARN.
 *
 * @param arn - The ARN of the Directory Service directory to delete.
 */
export const deleteDirectoryServiceDirectory = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new DirectoryServiceClient({ region });

  const directoryId = arn.split('/').pop();
  if (!directoryId) {
    return;
  }

  try {
    const command = new DeleteDirectoryCommand({ DirectoryId: directoryId });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Directory Service directory with directoryId: ${directoryId}`, error);
  }
};
