import { SageMakerClient, DeleteNotebookInstanceCommand, DeleteDomainCommand } from '@aws-sdk/client-sagemaker';

/**
 * Deletes a SageMaker Notebook Instance by its ARN.
 *
 * @param arn - The ARN of the SageMaker Notebook Instance to delete.
 */
export const deleteSageMakerNotebookInstance = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new SageMakerClient({ region });

  const notebookInstanceName = arn.split('/').pop();
  if (!notebookInstanceName) {
    return;
  }

  try {
    const command = new DeleteNotebookInstanceCommand({ NotebookInstanceName: notebookInstanceName });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete SageMaker Notebook Instance with name: ${notebookInstanceName}`, error);
  }
};

/**
 * Deletes a SageMaker Domain by its ID.
 *
 * @param domainId - The ID of the SageMaker Domain to delete.
 */
export const deleteSageMakerDomain = async (domainId: string): Promise<void> => {
  const client = new SageMakerClient({ region: 'us-east-1' });

  try {
    console.log(`Deleting SageMaker Domain with ID: ${domainId}`);
    const command = new DeleteDomainCommand({ DomainId: domainId });
    await client.send(command);
    console.log(`SageMaker Domain with ID: ${domainId} has been deleted successfully.`);
  } catch (error) {
    console.error(`Failed to delete SageMaker Domain with ID: ${domainId}`, error);
    throw error;
  }
};
