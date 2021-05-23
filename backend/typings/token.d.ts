export type CognitoToken = {
  sub: string;
  aud: string;
  email_verified: boolean;
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  given_name: string;
  iat: number;
  email: string;
  'cognito:username': string;
  'custom:tenant_id': string;
  'custom:role': string;
};
