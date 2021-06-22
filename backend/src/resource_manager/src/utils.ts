import express from 'express';
import { defaultTo } from 'lodash';
import winston from 'winston';
import { decode } from 'jsonwebtoken';

export const Logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
});

/** catch undefined errors */
export const common = async (req: express.Request, res: express.Response, app: any) => {
  Logger.info('request', req.body);

  try {
    const results = await app(req, res);

    Logger.info('response', results);

    res.status(200).send(results);
  } catch (err) {
    const message = defaultTo(err.response?.data, err.message);

    Logger.error('Unhandled error:', err);

    res.status(500).send(message);
  }
};

/**
 * decode bearer token
 *
 * @param token bearer token
 */
export const decodeToken = (token: string) => {
  // decode jwt token
  const decodedToken = decode(token, { complete: true });

  // decode failed
  if (decodedToken === null) throw new Error(`Decode token failed. ${token}`);

  return decodedToken.payload;
};

export const getToken = (req: express.Request) => {
  const authorizationToken = req.headers['authorization'] as string;

  // decode token
  return decodeToken(authorizationToken);
};
