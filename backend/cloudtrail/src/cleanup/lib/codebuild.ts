import { CodeBuildClient, DeleteProjectCommand } from '@aws-sdk/client-codebuild';

/**
 * Deletes a CodeBuild project by its ARN.
 *
 * @param arn - The ARN of the CodeBuild project to delete.
 */
export const deleteCodeBuildProject = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new CodeBuildClient({ region });

  const projectName = arn.split('/').pop();
  if (!projectName) {
    return;
  }

  try {
    const command = new DeleteProjectCommand({ name: projectName });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete CodeBuild project with projectName: ${projectName}`, error);
  }
};
