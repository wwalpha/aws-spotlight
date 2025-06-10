import { decode } from 'jsonwebtoken';
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
export const decodeToken = (token?: string) => {
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
  const decoded = decode(tokenValue, { complete: true });

  if (decoded === null) {
    throw new Error(`Decode token failed. ${tokenValue}`);
  }

  return decoded.payload;
};
