import { ECRClient, DeleteRepositoryCommand } from '@aws-sdk/client-ecr';

/**
 * Deletes an ECR repository by its ARN.
 *
 * @param arn - The ARN of the ECR repository to delete.
 */
export const deleteECRRepository = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new ECRClient({ region });

  const repositoryName = arn.split('/').pop();
  if (!repositoryName) {
    return;
  }

  try {
    const command = new DeleteRepositoryCommand({ repositoryName, force: true });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete ECR repository with repositoryName: ${repositoryName}`, error);
  }
};
