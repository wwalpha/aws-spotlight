import express from 'express';
import { defaultTo } from 'lodash';
import { DynamodbHelper } from '@alphax/dynamodb';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { authenticateUser, decodeAccessToken, isAuthenticateFailure, Logger, lookupUser } from './utils';
import { Environments } from './consts';
import { Auth, System, Tables } from 'typings';

const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });
const cognito = new CognitoIdentityServiceProvider({ endpoint: process.env.AWS_ENDPOINT });

// health check
export const healthCheck = () => {
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
  const userInfo = await lookupUser(request.username);

  // cognito user pool
  const userPool = new CognitoUserPool({
    ClientId: userInfo.clientId as string,
    UserPoolId: userInfo.userPoolId as string,
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

  return { idToken: idToken, accessToken: accessToken, refreshToken: refreshToken };
};

/**
 * Refresh id token, access token, refresh token
 *
 * @param req request
 * @returns
 */
export const initiateAuth = async (
  req: express.Request<any, any, Auth.InitiateAuthRequest>
): Promise<Auth.InitiateAuthResponse> => {
  const accessToken = decodeAccessToken(req.body.accessToken);
  const refreshToken = req.body.refreshToken;

  // Cognito information
  const clientId = accessToken.client_id;
  const userPoolId = accessToken.iss.substring(accessToken.iss.lastIndexOf('/') + 1);

  const results = await cognito
    .adminInitiateAuth({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
      ClientId: clientId,
      UserPoolId: userPoolId,
    })
    .promise();

  const authenticationResult = results.AuthenticationResult;

  // refresh token failed
  if (!authenticationResult) {
    throw new Error('Refresh token auth failed.');
  }

  if (!authenticationResult.AccessToken || !authenticationResult.IdToken) {
    throw new Error('Refresh token auth failed.');
  }

  return {
    idToken: authenticationResult.IdToken,
    accessToken: authenticationResult.AccessToken,
  };
};

/** get release informations */
export const release = async (): Promise<System.ReleaseResponse> => {
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
  const results = await helper.get<Tables.Settings.Releases>({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Key: {
      Id: 'RELEASE',
    } as Tables.Settings.Key,
  });

  if (!results || !results.Item) {
    throw new Error('Unknown version');
  }

  return {
    version: results.Item.Texts[0].version,
  };
};
