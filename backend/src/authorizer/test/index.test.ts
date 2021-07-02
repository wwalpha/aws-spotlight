import { handler } from '../src/index';

describe('authorizer', () => {
  test('api key', async () => {
    const res = await handler({
      service: 'authorizer',
      version: '2.0',
      type: 'REQUEST',
      routeArn: 'arn:aws:execute-api:us-east-1:999999999999:to9euzffqd/$default/GET/resources/audit/region',
      identitySource: ['tTn7RV44E73skrwC9QsAA8st20icURN4L6KPvOP0'],
      routeKey: 'GET /resources/audit/region',
      rawPath: '/resources/audit/region',
      rawQueryString: '',
      headers: {
        'accept-encoding': 'gzip, deflate',
        'content-length': '0',
        host: 'api.arms.aws-handson.com',
        'user-agent': 'vscode-restclient',
        'x-amzn-trace-id': 'Root=1-60dec1f1-6c437f6b6ff5e8b339e16487',
        'x-api-key': 'tTn7RV44E73skrwC9QsAA8st20icURN4L6KPvOP0',
        'x-forwarded-for': '20.63.190.214',
        'x-forwarded-port': '443',
        'x-forwarded-proto': 'https',
      },
      requestContext: {
        accountId: '999999999999',
        apiId: 'to9euzffqd',
        domainName: 'api.arms.aws-handson.com',
        domainPrefix: 'api',
        http: {
          method: 'GET',
          path: '/resources/audit/region',
          protocol: 'HTTP/1.1',
          sourceIp: '20.63.190.214',
          userAgent: 'vscode-restclient',
        },
        requestId: 'B1M9zjF1IAMEVwA=',
        routeKey: 'GET /resources/audit/region',
        stage: '$default',
        time: '02/Jul/2021:07:36:17 +0000',
        timeEpoch: 1625211377790,
      },
      level: 'info',
      message: 'event',
    });

    expect(res).toEqual({
      isAuthorized: true,
    });
  });
});
