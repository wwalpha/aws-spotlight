import jwtDecode from 'jwt-decode';
import { Token } from 'typings';
import winston from 'winston';

export const Logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
});

/**
 * decode bearer token
 *
 * @param token bearer token
 */
export const decodeToken = (token: string): Token.CognitoToken => {
  // decode jwt token
  const decodedToken = jwtDecode<Token.CognitoToken | undefined>(token);

  // decode failed
  if (!decodedToken) throw new Error(`Decode token failed. ${token}`);

  return decodedToken;
};
