import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('amazonmq.amazonaws.com', () => {
  test.only('AMAZONMQ_CreateBroker', async () => {
    const event = await sendMessage(Events.MQ_CreateBroker);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:mq:ap-northeast-1:999999999999:broker:b-0d6d99ae-a214-4bd6-a124-6593a7036bb0'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.MQ_CreateBroker);
  });

  test.only('AMAZONMQ_DeleteBroker', async () => {
    const event = await sendMessage(Events.MQ_DeleteBroker);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:mq:ap-northeast-1:999999999999:broker:b-0d6d99ae-a214-4bd6-a124-6593a7036bb0'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.MQ_DeleteBroker);
  });
});
