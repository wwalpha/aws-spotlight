import { CodeCommitClient, DeleteRepositoryCommand } from '@aws-sdk/client-codecommit';

/**
 * Deletes a CodeCommit repository by its ARN.
 *
 * @param arn - The ARN of the CodeCommit repository to delete.
 */
export const deleteCodeCommitRepository = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new CodeCommitClient({ region });

  const repositoryName = arn.split('/').pop();
  if (!repositoryName) {
    return;
  }

  try {
    const command = new DeleteRepositoryCommand({ repositoryName });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete CodeCommit repository with repositoryName: ${repositoryName}`, error);
  }
};
