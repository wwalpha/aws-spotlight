import express from 'express';
import { defaultTo } from 'lodash';
import axios from 'axios';
import { decodeToken, Logger } from './utils';
import { Endpoints } from './consts';
import { User, Token } from 'typings';
import { JwtPayload } from 'jsonwebtoken';

// health check
export const healthCheck = (_: any, res: express.Response) => {
  res.status(200).send({ service: 'Token Manager', isAlive: true });
};

/** catch undefined errors */
export const common = async (req: express.Request, res: express.Response, app: any) => {
  Logger.info('request', req.body);

  try {
    const results = await app(req, res);

    Logger.info('response', results);

    res.status(200).send(results);
  } catch (err) {
    const error = err as unknown as any;
    const message = defaultTo(error.response?.data, error.message);

    Logger.error('Unhandle error:', err);

    res.status(500).send(message);
  }
};

export const decode = async (req: express.Request, res: express.Response<Token.DecodeResponse>) => {
  // decode token
  const token = decodeToken(req.headers['authorization']);

  // get user info
  const response = await axios.get<User.GetUserResponse>(
    Endpoints.USER((token as JwtPayload)['cognito:username'] as string)
  );

  if (response.status != 200) {
    throw new Error(JSON.stringify(response.data));
  }

  // send response
  res.send({
    userId: response.data.userId,
    userName: response.data.userName,
    role: response.data.role,
  });
};
