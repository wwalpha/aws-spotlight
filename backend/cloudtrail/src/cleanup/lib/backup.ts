import { BackupClient, DeleteBackupVaultCommand, DeleteBackupPlanCommand } from '@aws-sdk/client-backup';

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
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Backup Vault with backupVaultName: ${backupVaultName}`, error);
  }
};

/**
 * Deletes a Backup Plan by its ARN.
 *
 * @param arn - The ARN of the Backup Plan to delete.
 */
export const deleteBackupPlan = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new BackupClient({ region });

  // Extract the backup plan ID from the ARN
  // Format: arn:aws:backup:region:account-id:backup-plan:plan-id
  const backupPlanId = arn.split(':').pop();
  if (!backupPlanId) {
    return;
  }

  try {
    const command = new DeleteBackupPlanCommand({
      BackupPlanId: backupPlanId,
    });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Backup Plan with ID: ${backupPlanId}`, error);
  }
};
