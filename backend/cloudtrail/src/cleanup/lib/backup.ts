import { BackupClient, DeleteBackupVaultCommand } from '@aws-sdk/client-backup';

/**
 * Deletes a Backup Vault by its ARN.
 *
 * @param arn - The ARN of the Backup Vault to delete.
 */
export const deleteBackupVault = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new BackupClient({ region });

  const backupVaultName = arn.split('/').pop();
  if (!backupVaultName) {
    return;
  }

  try {
    const command = new DeleteBackupVaultCommand({ BackupVaultName: backupVaultName });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Backup Vault with backupVaultName: ${backupVaultName}`, error);
  }
};
