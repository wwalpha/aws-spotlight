import express from 'express';
import { defaultTo } from 'lodash';
import axios from 'axios';
import { DynamodbHelper } from '@alphax/dynamodb';
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { authenticateUser, isAuthenticateFailure, Logger } from './utils';
import { API_URLs, Environments } from './consts';
import { Auth, System, User, Tables } from 'typings';

const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

// health check
export const healthCheck = (_: any, res: express.Response) => {
  Logger.info('health check');

  return { service: 'Auth Manager', isAlive: true };
};

/** catch undefined errors */
export const common = async (req: express.Request, res: express.Response, app: any) => {
  try {
    const results = await app(req, res);

    res.status(200).send(results);
  } catch (err) {
    const message = defaultTo(err.response?.data, err.message);

    Logger.error('Unhandle error:', err);

    res.status(500).send(message);
  }
};

// process login request
export const auth = async (req: express.Request<any, any, Auth.SignInRequest>): Promise<Auth.SignInResponse> => {
  Logger.info({
    username: req.body.username,
    password: '******',
  });

  const request = req.body;
  const userURL = API_URLs.LookupUser(request.username);

  // get userpool infos
  const response = await axios.get<User.LookupUserResponse>(userURL);

  // user not found
  if (response.status !== 200 || response.data.isExist === false) {
    throw new Error('User not found.');
  }

  // cognito user pool
  const userPool = new CognitoUserPool({
    ClientId: response.data.clientId as string,
    UserPoolId: response.data.userPoolId as string,
  });

  // cognito user
  const cognitoUser = new CognitoUser({
    Pool: userPool,
    Username: request.username,
  });

  const authDetails = new AuthenticationDetails({
    Username: request.username,
    Password: request.password,
  });

  const result = await authenticateUser(request, cognitoUser, authDetails);

  // authenticate failure
  if (isAuthenticateFailure(result)) {
    return {
      mfaRequired: 'mfaRequired' in result,
      newPasswordRequired: 'newPasswordRequired' in result,
    };
  }

  const session = result as CognitoUserSession;

  // get user id token and access token
  const idToken = session.getIdToken().getJwtToken();
  const accessToken = session.getAccessToken().getJwtToken();
  const refreshToken = session.getRefreshToken().getToken();

  return { token: idToken, accessToken: accessToken, refreshToken: refreshToken };
};

/** get release informations */
export const release = async (): Promise<System.ReleaseReseponse> => {
  const results = await helper.get<Tables.Settings.Releases>({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Key: {
      Id: 'RELEASE',
    } as Tables.Settings.Key,
  });

  if (!results || !results.Item) {
    throw new Error('Can not found release infomations.');
  }

  return {
    infos: results.Item.Texts,
  };
};

/** get current version */
export const version = async (): Promise<System.VersionResponse> => {
  return {
    version: 'v0.0.1',
  };
};
