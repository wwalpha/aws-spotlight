import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('timestream.amazonaws.com', () => {
  test('TIMESTREAM_CreateDatabase', async () => {
    const event = await sendMessage(Events.TIMESTREAM_CreateDatabase);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:timestream:ap-northeast-1:999999999999:database/sampleDB');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.TIMESTREAM_CreateDatabase);
  });

  test('TIMESTREAM_DeleteDatabase', async () => {
    const event = await sendMessage(Events.TIMESTREAM_DeleteDatabase);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:timestream:ap-northeast-1:999999999999:database/sampleDB');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.TIMESTREAM_DeleteDatabase);
  });
});
