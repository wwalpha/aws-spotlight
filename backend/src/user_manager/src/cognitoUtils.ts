import { DynamodbHelper } from '@alphax/dynamodb';
import { CognitoIdentityServiceProvider, Credentials } from 'aws-sdk';
import express from 'express';
import jwtDecode from 'jwt-decode';
import { Tables, User, Token } from 'typings';
import { Environments } from './consts';

// /**
//  * Lookup a user's pool data in the user table
//  *
//  * @param userId The id of the user being looked up
//  * @param isSystemContext Is this being called in the context of a system user (registration, system user provisioning)
//  * @param tenantId The id of the tenant (if this is not system context)
//  * @param credentials The credentials used ben looking up the user
//  */
// export const lookupUserPoolData = async (
//   userId: string,
//   credentials?: Credentials
// ): Promise<User.CognitoInfos | undefined> => {
//   const helper = new DynamodbHelper({
//     credentials: credentials,
//   });

//   const searchParams: Tables.UserKey = {
//     UserId: userId,
//   };

//   // get the item from the database
//   const results = await helper.get({
//     TableName: Environments.TABLE_NAME_USER,
//     Key: searchParams,
//   });

//   // not found
//   if (!results || !results.Item) {
//     return undefined;
//   }

//   const item = results.Item as Tables.UserItem;

//   // user founded
//   return {
//     ClientId: item.ClientId,
//     UserPoolId: item.UserPoolId,
//     IdentityPoolId: item.IdentityPoolId,
//   };
// };

/**
 * Create a new user using the supplied credentials/user
 *
 * @param credentials The creds used for the user creation
 * @param userInfo the tenant admin regist request
 * @param cognito The cognito infomations
 */
export const createNewUser = async (
  userInfo: User.TenantUser,
  userPoolId: string,
  role: 'TENANT_ADMIN' | 'TENANT_USER'
) => {
  const userItem: Tables.UserItem = {
    UserId: userInfo.email,
    UserName: userInfo.userName,
    Email: userInfo.email,
    Role: role,
  };

  // create cognito user;
  const user = await createCognitoUser(userPoolId, userItem);

  // set sub
  if (user.Attributes) {
    userItem.Sub = user.Attributes[0].Value;
  }

  const helper = new DynamodbHelper();

  // add user
  await helper.put({
    TableName: Environments.TABLE_USER,
    Item: userItem,
  });

  return userItem;
};

/**
 * Extract a token from the header and return its embedded user pool id
 *
 * @param req The request with the token
 * @returns The user pool id from the token
 */
export const getUserPoolIdFromToken = (req: express.Request) => {
  // get token from request
  const token = req.get('Authorization');
  // decode token
  const decodedToken = decodeToken(token);
  // get iss
  const iss = decodedToken.iss;

  // get user pool id
  return iss.substring(iss.lastIndexOf('/') + 1);
};

/**
 * decode bearer token
 *
 * @param token bearer token
 */
const decodeToken = (token?: string): Token.CognitoToken => {
  // not found
  if (!token) throw new Error(`BearerToken token not exist.`);

  // decode jwt token
  const decodedToken = jwtDecode<Token.CognitoToken | undefined>(token);

  // decode failed
  if (!decodedToken) throw new Error(`Decode token failed. ${token}`);

  return decodedToken;
};

/**
 * Create a new user
 *
 * @param credentials credentials
 * @param userPoolId user pool id
 * @param user user attributes
 *
 */
export const createCognitoUser = async (userPoolId: string, user: Tables.UserItem, credentials?: Credentials) => {
  // init service provider
  const provider = new CognitoIdentityServiceProvider({
    credentials: credentials,
  });

  // create new user
  const result = await provider
    .adminCreateUser({
      UserPoolId: userPoolId,
      Username: user.Email,
      DesiredDeliveryMediums: ['EMAIL'],
      ForceAliasCreation: true,
      UserAttributes: [
        {
          Name: 'email',
          Value: user.Email,
        },
        {
          Name: 'custom:role',
          Value: user.Role,
        },
      ],
    })
    .promise();

  const cognitoUser = result.User;

  if (!cognitoUser) throw new Error('Create new user failed.');

  return cognitoUser;
};
