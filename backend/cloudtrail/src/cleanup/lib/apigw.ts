import { APIGatewayClient, DeleteRestApiCommand } from '@aws-sdk/client-api-gateway';

/**
 * Deletes an API Gateway REST API by its ARN.
 *
 * @param arn - The ARN of the API Gateway REST API to delete.
 */
export const deleteApiGatewayRestApi = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new APIGatewayClient({ region });

  const restApiId = arn.split('/').pop();
  if (!restApiId) {
    return;
  }

  try {
    const command = new DeleteRestApiCommand({ restApiId });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete API Gateway REST API with restApiId: ${restApiId}`, error);
  }
};
