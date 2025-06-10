export namespace Token {
  type IdToken = {
    sub: string;
    aud: string;
    event_id: string;
    token_use: string;
    auth_time: number;
    iss: string;
    name: string;
    exp: number;
    iat: number;
    email: string;
    'cognito:username': string;
    'custom:role': string;
  };

  type AccessToken = {
    sub: string;
    event_id: string;
    token_use: string;
    scope: string;
    auth_time: number;
    iss: string;
    exp: number;
    iat: number;
    jti: number;
    client_id: string;
    username: string;
  };

  interface DecodeRequest {}

  interface DecodeResponse {
    userId: string;
    userName: string;
    role: string;
  }
}
