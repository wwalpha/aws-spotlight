import { LambdaClient, DeleteFunctionCommand } from '@aws-sdk/client-lambda';

/**
 * Deletes a Lambda Function by its ARN.
 *
 * @param arn - The ARN of the Lambda Function to delete.
 */
export const deleteLambdaFunction = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new LambdaClient({ region });

  const functionName = arn.split(':').pop();
  if (!functionName) {
    return;
  }

  try {
    const command = new DeleteFunctionCommand({ FunctionName: functionName });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Lambda Function with name: ${functionName}`, error);
  }
};
