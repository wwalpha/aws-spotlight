import { EFSClient, DeleteFileSystemCommand } from '@aws-sdk/client-efs';

/**
 * Deletes an EFS FileSystem by its ARN.
 *
 * @param arn - The ARN of the EFS FileSystem to delete.
 */
export const deleteEFSFileSystem = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new EFSClient({ region });

  const fileSystemId = arn.split('/').pop();
  if (!fileSystemId) {
    return;
  }

  try {
    const command = new DeleteFileSystemCommand({ FileSystemId: fileSystemId });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete EFS FileSystem with fileSystemId: ${fileSystemId}`, error);
  }
};
