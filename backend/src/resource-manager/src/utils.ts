import jwtDecode from 'jwt-decode';
import { Token } from 'typings';

/**
 * decode bearer token
 *
 * @param bearerToken bearer token
 */
export const decodeToken = (bearerToken?: string): Token.CognitoToken => {
  // not found
  if (!bearerToken) throw new Error(`BearerToken token not exist.`);

  // convert
  const token = bearerToken.substring(bearerToken.indexOf(' ') + 1);
  // decode jwt token
  const decodedToken = jwtDecode<Token.CognitoToken | undefined>(token);

  // decode failed
  if (!decodedToken) throw new Error(`Decode token failed. ${bearerToken}`);

  return decodedToken;
};
