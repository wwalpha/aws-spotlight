import { handler } from '../src/index';

const start = async () => {
  const res = await handler({
    headers: {
      'X-API-Key': 'AAAAAAAAAAAAAAAA',
    },
    identitySource: ['test'],
    rawPath: '/',
    rawQueryString: '',
    requestContext: {
      accountId: '999999999999',
      apiId: 'test',
      http: {} as any,
      requestId: 'test',
      routeKey: 'test',
      stage: 'default',
      time: '100',
      timeEpoch: 100,
    },
    type: 'REQUEST',
    routeArn: 'arn;aaaa',
    routeKey: 'test',
    version: '1.0',
  });

  console.log(res);
};

start();
