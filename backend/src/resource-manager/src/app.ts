import express from 'express';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Resource, Tables } from 'typings';
import { decodeToken, Logger } from './utils';

const helper = new DynamodbHelper();
const TABLE_NAME_RESOURCE = process.env.TABLE_NAME_RESOURCE as string;

// health check
export const healthCheck = (_: any, res: express.Response) => {
  res.status(200).send({ service: 'Resource Manager', isAlive: true });
};

/**
 * Get service resource list by username
 *
 * @param req
 * @param res
 */
export const getResourceList = async (
  req: express.Request<Resource.GetResourceParameter, any, Resource.GetResourceRequest>,
  res: express.Response<Resource.GetResourceResponse>
) => {
  // request
  Logger.info(req);

  // parameters
  const params = req.params;
  // decode token
  const token = decodeToken(req.headers['authorization']);

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

  // results
  res.send({
    items: result.Items,
  });
};
