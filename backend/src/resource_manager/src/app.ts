import express from 'express';
import { SNS } from 'aws-sdk';
import { DynamodbHelper } from '@alphax/dynamodb';
import { orderBy } from 'lodash';
import { Resource, Tables } from 'typings';
import { decodeToken, getToken, Logger } from './utils';
import { ROLE, Environments } from './consts';

const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });
const snsClient = new SNS();

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
  // @ts-ignore
  const role = token['custom:role'];

  // administrator
  if (role === ROLE.ADMIN) {
    // get service resources
    const result = await helper.query<Tables.TResource>({
      TableName: Environments.TABLE_NAME_RESOURCES,
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
    const result = await helper.query<Tables.TResource>({
      TableName: Environments.TABLE_NAME_RESOURCES,
      KeyConditionExpression: '#UserName = :UserName AND begins_with(#ResourceId, :ResourceId)',
      IndexName: 'gsiIdx2',
      ExpressionAttributeNames: {
        '#UserName': 'UserName',
        '#ResourceId': 'ResourceId',
      },
      ExpressionAttributeValues: {
        //@ts-ignore
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
  // @ts-ignore
  const role = token['custom:role'];
  // @ts-ignore
  const username = token['cognito:username'];

  // administrator
  if (role === ROLE.ADMIN) {
    const result = await helper.scan<Tables.TResource>({
      TableName: Environments.TABLE_NAME_RESOURCES,
      ProjectionExpression: 'EventSource',
    });

    const sets = new Set(result.Items.map((item) => item.EventSource));

    return { categories: Array.from(sets) };
  } else {
    // normal user
    // get event source list
    const result = await helper.query<Tables.TResource>({
      TableName: Environments.TABLE_NAME_RESOURCES,
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

export const auditRegion = async (): Promise<void> => {
  const settings = await helper.get<Tables.Settings.GlobalServices>({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Key: {
      Id: 'GLOBAL_SERVICES',
    } as Tables.Settings.Key,
  });

  const services = settings?.Item?.Services;

  const result = await helper.scan<Tables.TResource>({
    TableName: Environments.TABLE_NAME_RESOURCES,
    FilterExpression: 'AWSRegion <> :AWSRegion',
    ExpressionAttributeValues: {
      ':AWSRegion': 'ap-northeast-1',
    },
  });

  const targets = result.Items.filter((item) => {
    if (!services) return true;

    // exclude global services
    return !services.includes(item.EventSource);
  })
    // exclude arms system resource
    .filter((item) => item.ResourceId.toUpperCase().indexOf('ARMS') === -1)
    // include dxc user
    .filter((item) => item.UserName.endsWith('dxc.com'));

  // no targets
  if (targets.length === 0) {
    return;
  }

  // sort by username
  const sorted = orderBy(targets, ['UserName', 'ResourceId'], ['asc', 'asc']);

  // create message body
  const messages = sorted.map((item) => {
    return `<strong>UserName:</strong> ${item.UserName}  <strong>ARN:</strong> ${item.ResourceId}`;
  });

  // send to admin
  await snsClient
    .publish({
      TopicArn: Environments.SNS_TOPIC_ARN_ADMIN,
      Subject: 'Outscope region resources',
      Message: messages.join('\n'),
    })
    .promise();
};
