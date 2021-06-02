import express from 'express';
import jwtDecode from 'jwt-decode';
import { Token } from 'typings';

// /**
//  * Get tenant id from token
//  *
//  * @param req request
//  * @returns
//  */
// export const getTenantIdFromToken = (req: express.Request) => {
//   // get token from request
//   const bearerToken = req.get('Authorization');
//   // decode token
//   const decodedToken = decodeToken(bearerToken);
//   // return tenant id
//   return decodedToken['custom:tenant_id'];
// };

/**
 * decode bearer token
 *
 * @param bearerToken bearer token
 */
const decodeToken = (bearerToken?: string): Token.CognitoToken => {
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
