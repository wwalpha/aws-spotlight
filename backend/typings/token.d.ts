export namespace Token {
  type CognitoToken = {
    sub: string;
    aud: string;
    email_verified: boolean;
    event_id: string;
    token_use: string;
    auth_time: number;
    iss: string;
    'cognito:username': string;
    exp: number;
    iat: number;
    email: string;
  };

  interface DecodeRequest {}

  interface DecodeResponse {
    userid: string;
    username: string;
    type: string;
  }
}
