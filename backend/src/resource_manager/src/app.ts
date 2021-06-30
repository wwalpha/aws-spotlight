import express from 'express';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Resource, Tables } from 'typings';
import { decodeToken, getToken, Logger } from './utils';
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
      IndexName: 'gsiIdx1',
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
      KeyConditionExpression: '#UserName = :UserName AND begins_with(#ResourceId, :ResourceId)',
      IndexName: 'gsiIdx2',
      ExpressionAttributeNames: {
        '#UserName': 'UserName',
        '#ResourceId': 'ResourceId',
      },
      ExpressionAttributeValues: {
        ':UserName': token['cognito:username'],
        ':ResourceId': `arn:aws:${params.service}`,
      },
    });

    return { items: result.Items };
  }
};

export const getCategoryList = async (
  req: express.Request<any, any, Resource.GetCategoryRequest>
): Promise<Resource.GetCategoryResponse> => {
  // decode token
  const token = getToken(req);
  const role = token['custom:role'];
  const username = token['cognito:username'];

  // administrator
  if (role === ROLE.ADMIN) {
    const result = await helper.scan<Tables.Resource>({
      TableName: TABLE_NAME_RESOURCE,
      ProjectionExpression: 'EventSource',
    });

    const sets = new Set(result.Items.map((item) => item.EventSource));

    return { categories: Array.from(sets) };
  } else {
    // normal user
    // get event source list
    const result = await helper.query<Tables.Resource>({
      TableName: TABLE_NAME_RESOURCE,
      ProjectionExpression: 'EventSource',
      KeyConditionExpression: '#UserName = :UserName',
      IndexName: 'gsiIdx2',
      ExpressionAttributeNames: {
        '#UserName': 'UserName',
      },
      ExpressionAttributeValues: {
        ':UserName': username,
      },
    });

    const sets = new Set(result.Items.map((item) => item.EventSource));

    return { categories: Array.from(sets) };
  }
};
