export * from '../../../typings/index';

export interface Token {
  header: TokenHeader;
  payload: Claim;
  signature: string;
}

export interface TokenHeader {
  kid: string;
  alg: string;
}

export interface Claim {
  sub: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  iss: string;
  exp: string;
  iat: string;
  email: string;
}

export interface APIGatewayRequestAuthorizerEventV2 {
  version: string;
  type: 'REQUEST';
  routeArn: string;
  identitySource: string[];
  routeKey: string;
  rawPath: string;
  rawQueryString: string;
  headers: Record<string, string | undefined>;
  requestContext: {
    accountId: string;
    apiId: string;
    domainName?: string;
    domainPrefix?: string;
    http: {
      method: string;
      path: string;
      protocol: string;
      sourceIp: string;
      userAgent: string;
    };
    requestId: string;
    routeKey: string;
    stage: string;
    time: string;
    timeEpoch: number;
  };
}

export interface APIGatewayRequestAuthorizerResultV2 {
  isAuthorized: boolean;
  context?: Record<string, any>;
}
