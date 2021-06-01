import express from 'express';
import { defaultTo } from 'lodash';
import axios from 'axios';
import { decodeToken, getLogger } from './utils';
import { Endpoints, Environments } from './consts';
import { User } from 'typings';
import { Token } from '../../../typings/token';

const logger = getLogger();

// health check
export const healthCheck = (_: any, res: express.Response) => {
  res.status(200).send({ service: 'Token Manager', isAlive: true });
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

export const decode = async (req: express.Request, res: express.Response<Token.DecodeResponse>) => {
  // decode token
  const token = decodeToken(req.headers['authorization']);

  // get user info
  const response = await axios.get<User.GetUserResponse>(Endpoints.USER(token['cognito:username']));

  if (response.status != 200) {
    throw new Error(JSON.stringify(response.data));
  }

  // send response
  res.send({
    userid: response.data.userid,
    username: response.data.username,
    type: response.data.type,
  });
};
