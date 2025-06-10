import AWS from 'aws-sdk';
import express from 'express';
import { DynamodbHelper } from '@alphax/dynamodb';
import { User, Tables } from 'typings';
import { Environments } from './consts';
import { createNewUser, getUsers, lookupUserPoolData } from './cognito';
import { Logger } from './utils';

// update aws config
AWS.config.update({
  region: Environments.AWS_REGION,
  dynamodb: { endpoint: Environments.AWS_ENDPOINT },
});

const helper = new DynamodbHelper();

// health check
export const healthCheck = async () => ({ service: 'User Manager', isAlive: true });

/**
 * lookup user in cognito
 *
 * @param req request
 */
export const lookupUser = async (req: express.Request): Promise<User.LookupUserResponse> => {
  Logger.debug('Looking up user pool data for: ' + req.params.id);

  // find user in user pool
  const user = await lookupUserPoolData(req.params.id);

  // lookup user response
  return {
    isExist: user !== undefined,
    identityPoolId: user?.IdentityPoolId,
    userPoolId: user?.UserPoolId,
    clientId: user?.ClientId,
  };
};

/**
 * Create a new user
 *
 * @param req request
 * @returns created user details
 */
export const createUser = async (
  req: express.Request<any, any, User.CreateUserRequest>
): Promise<User.CreateUserResponse> => {
  Logger.debug(`Creating user: ${req.body.email}`);

  const settings = await helper.get<Tables.Settings.Cognito>({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Key: {
      Id: 'TENANT_USER',
    },
  });

  // data not found
  if (!settings || !settings.Item) {
    throw new Error('Cannot find cognito settings');
  }
  console.log(req.body);
  // create new user
  const user = await createNewUser(req.body, settings.Item.UserPoolId, 'TENANT_USER');

  return {
    userId: user.Email,
  };
};

/**
 * Create a new admin user
 *
 * @param req request
 * @returns
 */
export const createAdminUser = async (
  req: express.Request<any, any, User.CreateAdminRequest>
): Promise<User.CreateAdminResponse> => {
  Logger.debug(`Creating user: ${req.body.email}`);

  const request = req.body;

  const settings = await helper.get<Tables.Settings.Cognito>({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Key: {
      Id: 'TENANT_ADMIN',
    },
  });

  // data not found
  if (!settings || !settings.Item) {
    throw new Error('Cannot find cognito settings');
  }

  // create admin user
  const userItem = await createNewUser(request, settings.Item.UserPoolId, 'TENANT_ADMIN');

  return { userId: userItem.UserId, email: userItem.Email, userName: userItem.UserName };
};

export const listAdminUsers = async (): Promise<User.ListAdminUsersResponse> => {
  const settings = await helper.get<Tables.Settings.Cognito>({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Key: {
      Id: 'TENANT_ADMIN',
    },
  });

  if (!settings?.Item?.UserPoolId) {
    throw new Error('Cannot found admin settings');
  }

  const users = await getUsers(settings.Item.UserPoolId);

  return {
    users,
  };
};
