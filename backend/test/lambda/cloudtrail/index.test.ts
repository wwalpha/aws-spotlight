import { handler } from '@lambda/cloudtrail';
import { SNSEvent } from 'aws-lambda';
import test001_inputs from './datas/test001_inputs.json';

describe('CloudTrail', () => {
  test('Case001', async () => {
    await handler(test001_inputs as SNSEvent);
  });
});
