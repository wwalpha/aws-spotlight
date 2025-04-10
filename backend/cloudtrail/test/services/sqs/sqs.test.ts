import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('sqs.amazonaws.com', () => {
  test('SQS_CreateQueue', async () => {
    const event = await sendMessage(Events.SQS_CreateQueue);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:sqs:us-east-1:999999999999:arms-deadletter');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SQS_CreateQueue);
  });

  test('SQS_DeleteQueue', async () => {
    const event = await sendMessage(Events.SQS_DeleteQueue);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:sqs:us-east-1:999999999999:arms-deadletter');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SQS_DeleteQueue);
  });
});
