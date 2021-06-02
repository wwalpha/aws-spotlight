import jwtDecode from 'jwt-decode';
import { Token } from 'typings';
import winston from 'winston';

export const getLogger = () =>
  winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()],
  });

/**
 * decode bearer token
 *
 * @param token bearer token
 */
export const decodeToken = (token?: string): Token.CognitoToken => {
  // not found
  if (!token) throw new Error(`Bearer token not exist.`);

  let tokenValue: string = token;

  // bearer token check
  if (token.indexOf(' ') != -1) {
    const startWith = token.split(' ')[0];

    if (startWith.toUpperCase() !== 'BEARER') {
      throw new Error('Token format is not correct.');
    }

    tokenValue = token.substring(token.indexOf(' ') + 1);
  }

  // decode jwt token
  const decoded = jwtDecode<Token.CognitoToken | undefined>(tokenValue);

  if (!decoded) {
    throw new Error(`Decode token failed. ${tokenValue}`);
  }

  return decoded;
};
