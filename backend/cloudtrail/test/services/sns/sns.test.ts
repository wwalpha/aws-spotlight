import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('sns.amazonaws.com', () => {
  test('SNS_CreateTopic', async () => {
    const event = await sendMessage(Events.SNS_CreateTopic);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:sns:us-east-1:999999999999:arms-admin');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SNS_CreateTopic);
  });

  test('SNS_DeleteTopic', async () => {
    const event = await sendMessage(Events.SNS_DeleteTopic);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:sns:us-east-1:999999999999:arms-admin');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SNS_DeleteTopic);
  });
});
