import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe.skip('transfer.amazonaws.com', () => {
  test('TRANSFER_CreateServer', async () => {
    const event = await sendMessage(Events.TRANSFER_CreateServer);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:transfer:ap-northeast-1:999999999999:server/s-61ada58e71d74f8da');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.TRANSFER_CreateServer);
  });

  test('TRANSFER_DeleteServer', async () => {
    const event = await sendMessage(Events.TRANSFER_DeleteServer);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:transfer:ap-northeast-1:999999999999:server/s-61ada58e71d74f8da');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.TRANSFER_DeleteServer);
  });
});
