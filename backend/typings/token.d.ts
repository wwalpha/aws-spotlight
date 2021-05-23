export type CognitoToken = {
  sub: string;
  aud: string;
  email_verified: boolean;
  token_use: string;
  auth_time: number;
  iss: string;
  iat: number;
  jti: string;
  event_id: string;
  scope: string;
  client_id: string;
  username: string;
};
