import express from 'express';
import { defaultTo } from 'lodash';
import axios from 'axios';
import { authenticateUser, getLogger, isAuthenticateFailure } from './utils';
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { UserLoginRequest, UserPoolInfo } from 'typings';
import { API_URLs } from './consts';

const logger = getLogger();

// health check
export const healthCheck = (_: any, res: express.Response) => {
  res.status(200).send({ service: 'Auth Manager', isAlive: true });
};

/** catch undefined errors */
export const common = async (req: express.Request, res: express.Response, app: any) => {
  logger.info('request', req.body);

  try {
    const results = await app(req, res);

    logger.info('response', results);

    res.status(200).send(results);
  } catch (err) {
    const message = defaultTo(err.response?.data, err.message);

    logger.error('Unhandle error:', err);

    res.status(500).send(message);
  }
};

// process login request
export const auth = async (req: express.Request<any, any, UserLoginRequest>) => {
  const request = req.body;
  const userURL = API_URLs.GetUser(request.username);

  // get userpool infos
  const response = (await axios.get<UserPoolInfo>(userURL)).data;

  // cognito user pool
  const userPool = new CognitoUserPool({
    ClientId: response.clientId,
    UserPoolId: response.userPoolId,
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
    return result;
  }

  const session = result as CognitoUserSession;

  // get user id token and access token
  const idToken = session.getIdToken().getJwtToken();
  const accessToken = session.getAccessToken().getJwtToken();

  return { token: idToken, accessToken: accessToken };
};
