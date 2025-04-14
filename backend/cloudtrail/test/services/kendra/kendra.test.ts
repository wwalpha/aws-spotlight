import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('kendra.amazonaws.com', () => {
  test('KENDRA_CreateIndex', async () => {
    const event = await sendMessage(Events.KENDRA_CreateIndex);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:kendra:us-east-1:999999999999:index/83084183-4a5a-4bc1-afba-b5b6f1640c6b'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.KENDRA_CreateIndex);
  });

  test('KENDRA_DeleteIndex', async () => {
    const event = await sendMessage(Events.KENDRA_DeleteIndex);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:kendra:us-east-1:999999999999:index/83084183-4a5a-4bc1-afba-b5b6f1640c6b'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.KENDRA_DeleteIndex);
  });
});
