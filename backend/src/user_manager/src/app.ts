import AWS from 'aws-sdk';
import express from 'express';
import { DynamodbHelper } from '@alphax/dynamodb';
import { User, Tables } from 'typings';
import { Environments } from './consts';
import { createNewUser } from './cognitoUtils';
import { Logger } from './utils';

// update aws config
AWS.config.update({
  region: Environments.AWS_REGION,
  dynamodb: { endpoint: Environments.AWS_ENDPOINT_URL },
});

const helper = new DynamodbHelper();

// health check
export const healthCheck = async () => ({ service: 'User Manager', isAlive: true });

// /**
//  * lookup user in cognito
//  *
//  * @param req request
//  */
// export const lookupUser = async (req: express.Request): Promise<User.LookupUserResponse> => {
//   Logger.debug('Looking up user pool data for: ' + req.params.id);

//   // find user in user pool
//   const user = await lookupUserPoolData(req.params.id);

//   // lookup user response
//   return {
//     isExist: user !== undefined,
//     identityPoolId: user?.IdentityPoolId,
//     userPoolId: user?.UserPoolId,
//     clientId: user?.ClientId,
//   };
// };

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
    TableName: Environments.TABLE_SETTINGS,
    Key: {
      Id: 'COGNITO_USER',
    },
  });

  // data not found
  if (!settings || !settings.Item) {
    throw new Error('Cannot find cognito settings');
  }

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
    TableName: Environments.TABLE_SETTINGS,
    Key: {
      Id: 'COGNITO_ADMIN',
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

/**
 * Create a system admin user
 *
 * @param req request
 * @returns
 */
// export const createSystemAdmin = async (
//   req: express.Request<any, any, User.CreateAdminRequest>
// ): Promise<User.CreateAdminResponse> => {
//   logger.debug('Creating a system admin user.');

//   const request = req.body;

//   // create cognito user pool and identity pool
//   const cognito = await provisionSystemAdminUserWithRoles(request);
//   // create admin user
//   const userItem = await createNewUser(request, cognito, 'TENANT_ADMIN');

//   return userItem as User.CreateAdminResponse;
// };

// /**
//  * Get all users in cognito
//  *
//  * @param req request
//  * @returns all users
//  */
// export const getUsers = async (req: express.Request): Promise<User.GetUsersResponse> => {
//   // get credentials
//   const credentials = await getCredentialsFromToken(req);
//   // user pool id
//   const userPoolId = getUserPoolIdFromToken(req);
//   // get cognito users
//   const users = await listCognitoUsers(userPoolId, credentials);

//   // return all items
//   return users.map<User.GetUserResponse>((item) => ({
//     userName: item.userName,
//     enabled: item.enabled,
//     status: item.status,
//     firstName: item.firstName,
//     lastName: item.lastName,
//   }));
// };

// /**
//  * Get user details
//  *
//  * @param req request
//  * @returns
//  */
// export const getUser = async (req: express.Request): Promise<User.GetUserResponse> => {
//   logger.debug('Getting user id: ' + req.params.id);

//   const credentials = await getCredentialsFromToken(req);
//   const tenantId = getTenantIdFromToken(req);

//   // check user exists
//   const cognito = await lookupUserPoolData(req.params.id, false, tenantId, credentials);

//   // error check
//   if (!cognito) throw new Error(`User not found: ${req.params.id}`);

//   const user = await getCognitoUser(cognito.UserPoolId, req.params.id, credentials);

//   return {
//     userName: user.userName,
//     enabled: defaultTo(user.enabled, false),
//     firstName: defaultTo(user.firstName, ''),
//     lastName: defaultTo(user.lastName, ''),
//     status: defaultTo(user.status, ''),
//   };
// };

// /**
//  * update user details
//  *
//  * @param req request
//  * @returns created user details
//  */
// export const updateUser = async (
//   req: express.Request<any, any, User.UpdateUserRequest>
// ): Promise<User.UpdateUserResponse> => {
//   // get user credentials
//   const credentials = await getCredentialsFromToken(req);
//   // tenant id
//   const tenantId = getTenantIdFromToken(req);
//   // check user exists
//   const cognito = await lookupUserPoolData(req.params.id, false, tenantId, credentials);

//   // error check
//   if (!cognito) throw new Error(`User not found: ${req.params.id}`);

//   // update user details
//   await updateCognitoUser(cognito.UserPoolId, req.body, credentials);

//   return {
//     status: 'success',
//   };
// };

// /**
//  * delete a cognito user
//  *
//  * @param req request
//  */
// export const deleteUser = async (req: express.Request): Promise<User.DeleteUserResponse> => {
//   const userName = req.params.id;

//   // get user credentials
//   const credentials = await getCredentialsFromToken(req);
//   // tenant id
//   const tenantId = getTenantIdFromToken(req);
//   // check user exists
//   const cognito = await lookupUserPoolData(req.params.id, false, tenantId, credentials);

//   // error check
//   if (!cognito) throw new Error(`User not found: ${req.params.id}`);

//   // delete user
//   await deleteCognitoUser(cognito.UserPoolId, userName, credentials);

//   return {
//     status: 'success',
//   };
// };

// /**
//  * remove all dynamodb tables
//  *
//  * @param req request
//  * @param res response
//  */
// export const deleteTables = async (req: express.Request) => {
//   const helper = new DynamodbHelper();

//   // user table
//   await helper.getClient().deleteTable({ TableName: Environments.TABLE_NAME_USER }).promise();

//   // product table
//   await helper.getClient().deleteTable({ TableName: Environments.TABLE_NAME_PRODUCT }).promise();

//   // order table
//   await helper.getClient().deleteTable({ TableName: Environments.TABLE_NAME_ORDER }).promise();

//   // tenant table
//   await helper.getClient().deleteTable({ TableName: Environments.TABLE_NAME_TENANT }).promise();

//   return 'Initiated removal of DynamoDB Tables';
// };

// /**
//  * Delete cognito user pool, identity pool and IAM roles
//  *
//  * @param req request
//  */
// export const deleteTenant = async (req: express.Request<any, any, User.DeleteTenantRequest>) => {
//   logger.debug('Cleaning up Identity Reference Architecture');

//   const { tenantId, userPoolId, identityPoolId } = req.body;

//   // delete user pool
//   const provider = new CognitoIdentityServiceProvider();
//   await provider.deleteUserPool({ UserPoolId: userPoolId }).promise();

//   // delete identity pool
//   const identity = new CognitoIdentity();
//   await identity.deleteIdentityPool({ IdentityPoolId: identityPoolId }).promise();

//   // delete iam roles
//   await deleteRole(`SaaS_${tenantId}_AdminRole`, 'AdminPolicy');
//   await deleteRole(`SaaS_${tenantId}_UserRole`, 'UserPolicy');
//   await deleteRole(`SaaS_${tenantId}_AuthRole`);

//   const helper = new DynamodbHelper();

//   // get all users
//   const results = await helper.query({
//     TableName: Environments.TABLE_NAME_USER,
//     ProjectionExpression: 'tenantId, id',
//     KeyConditionExpression: '#tenantId = :tenantId',
//     ExpressionAttributeNames: {
//       '#tenantId': 'tenantId',
//     },
//     ExpressionAttributeValues: {
//       ':tenantId': tenantId,
//     },
//   });

//   if (results.Items) {
//     // remove user rows
//     await helper.truncate(Environments.TABLE_NAME_USER, results.Items);
//   }
// };
