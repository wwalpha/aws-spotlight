import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('iot.amazonaws.com', () => {
  test('IOT_CreateTopicRule', async () => {
    const event = await sendMessage(Events.IOT_CreateTopicRule);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:iot:ap-northeast-1:999999999999:rule/darRule');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.IOT_CreateTopicRule);
  });

  test('IOT_DeleteTopicRule', async () => {
    const event = await sendMessage(Events.IOT_DeleteTopicRule);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:iot:ap-northeast-1:999999999999:rule/darRule');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.IOT_DeleteTopicRule);
  });
});
