import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
  IAuthenticationCallback,
} from 'amazon-cognito-identity-js';
import axios from 'axios';
import winston from 'winston';
import { Auth, User, Token } from 'typings';
import { API_URLs } from './consts';
import { decode } from 'jsonwebtoken';

export const Logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
});

export const authenticateUser = (
  request: Auth.SignInRequest,
  cognitoUser: CognitoUser,
  authDetails: AuthenticationDetails
) =>
  new Promise<CognitoUserSession | Auth.AuthenticateFailure>((resolve, reject) => {
    // authenticate callback
    const callback: IAuthenticationCallback = {
      onSuccess: (session: CognitoUserSession) => resolve(session),
      mfaRequired: () => {
        if (!request.mfaCode) {
          // @ts-ignore
          resolve({ mfaRequired: true });
          return;
        }

        cognitoUser.sendMFACode(request.mfaCode, callback);
      },
      newPasswordRequired: (userAttributes: any) => {
        if (!request.newPassword) {
          // @ts-ignore
          resolve({ newPasswordRequired: true });
          return;
        }

        // These attributes are not mutable and should be removed from map.
        delete userAttributes.email_verified;
        delete userAttributes['custom:tenant_id'];

        cognitoUser.completeNewPasswordChallenge(request.newPassword, userAttributes, callback);
      },
      onFailure: (err) => reject(err),
    };

    cognitoUser.authenticateUser(authDetails, callback);
  });

export const isAuthenticateFailure = (value: any): boolean => {
  return 'newPasswordRequired' in value || 'mfaRequired' in value;
};

/** lookup user */
export const lookupUser = async (username: string): Promise<User.LookupUserResponse> => {
  const userURL = API_URLs.LookupUser(username);

  // get userpool infos
  const response = await axios.get<User.LookupUserResponse>(userURL);

  // user not found
  if (response.status !== 200 || response.data.isExist === false) {
    throw new Error('User not found.');
  }

  return response.data;
};

/** decode access token */
export const decodeAccessToken = (token: string): Token.AccessToken => {
  // Fail if the token is not jwt
  const jwt = decode(token, { complete: true });

  if (jwt === null) {
    throw new Error('Not a valid JWT token');
  }

  return jwt.payload as unknown as Token.AccessToken;
};
