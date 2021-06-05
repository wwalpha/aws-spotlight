import express from 'express';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Resource, Tables } from 'typings';
import { decodeToken, Logger } from './utils';
import { ROLE } from './consts';

const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });
const TABLE_NAME_RESOURCE = process.env.TABLE_NAME_RESOURCE as string;

// health check
export const healthCheck = (_: express.Request, res: express.Response) => {
  Logger.info('Health check...');

  res.status(200).send({ service: 'Resource Manager', isAlive: true });
};

/**
 * Get service resource list by username
 *
 * @param req
 * @param res
 */
export const getResourceList = async (
  req: express.Request<Resource.GetResourceParameter, any, Resource.GetResourceRequest>
): Promise<Resource.GetResourceResponse> => {
  // parameters
  const params = req.params;
  const authorizationToken = req.headers['authorization'] as string;

  // decode token
  const token = decodeToken(authorizationToken);
  const role = token['custom:role'];

  // administrator
  if (role === ROLE.ADMIN) {
    // get service resources
    const result = await helper.query<Tables.Resource>({
      TableName: TABLE_NAME_RESOURCE,
      KeyConditionExpression: '#EventSource = :EventSource',
      ExpressionAttributeNames: {
        '#EventSource': 'EventSource',
      },
      ExpressionAttributeValues: {
        ':EventSource': `${params.service}.amazonaws.com`,
      },
    });

    return { items: result.Items };
  } else {
    // normal user
    // get service resources
    const result = await helper.query<Tables.Resource>({
      TableName: TABLE_NAME_RESOURCE,
      KeyConditionExpression: '#UserName = :UserName AND #EventSource = :EventSource',
      IndexName: 'gsiIdx1',
      ExpressionAttributeNames: {
        '#UserName': 'UserName',
        '#EventSource': 'EventSource',
      },
      ExpressionAttributeValues: {
        ':UserName': token['cognito:username'],
        ':EventSource': `${params.service}.amazonaws.com`,
      },
    });

    return { items: result.Items };
  }
};
