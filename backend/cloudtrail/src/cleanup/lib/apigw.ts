import { APIGatewayClient, DeleteRestApiCommand, GetRestApiCommand } from '@aws-sdk/client-api-gateway';
import { ApiGatewayV2Client, DeleteApiCommand, GetApiCommand } from '@aws-sdk/client-apigatewayv2';

export const deleteApiGatewayApi = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new APIGatewayClient({ region });

  const restapi = await client.send(new GetRestApiCommand({ restApiId: arn.split('/').pop() }));

  if (restapi) {
    await deleteApiGatewayRestApi(arn);
  }

  const clientv2 = new ApiGatewayV2Client({ region });
  const httpapi = await clientv2.send(new GetApiCommand({ ApiId: arn.split('/').pop() }));

  if (httpapi) {
    await deleteApiGatewayHttpApi(arn);
  }
};

/**
 * Deletes an API Gateway REST API by its ARN.
 *
 * @param arn - The ARN of the API Gateway REST API to delete.
 */
const deleteApiGatewayRestApi = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new APIGatewayClient({ region });

  const restApiId = arn.split('/').pop();
  if (!restApiId) {
    return;
  }

  try {
    const command = new DeleteRestApiCommand({ restApiId });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete API Gateway REST API with restApiId: ${restApiId}`, error);
  }
};

/**
 * Deletes an API Gateway REST API by its ARN.
 *
 * @param arn - The ARN of the API Gateway REST API to delete.
 */
const deleteApiGatewayHttpApi = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new ApiGatewayV2Client({ region });

  const apiId = arn.split('/').pop();
  if (!apiId) {
    return;
  }

  try {
    const command = new DeleteApiCommand({ ApiId: apiId });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete API Gateway HTTP API with ApiId: ${apiId}`, error);
  }
};
