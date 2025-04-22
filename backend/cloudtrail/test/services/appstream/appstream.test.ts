import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('appstream.amazonaws.com', () => {
  test('APPSTREAM_CreateFleet', async () => {
    const event = await sendMessage(Events.APPSTREAM_CreateFleet);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:appstream:ap-northeast-1:999999999999:fleet/MW-Demo-01');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APPSTREAM_CreateFleet);
  });

  test('APPSTREAM_DeleteFleet', async () => {
    const event = await sendMessage(Events.APPSTREAM_DeleteFleet);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:appstream:ap-northeast-1:999999999999:fleet/MW-Demo-01');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APPSTREAM_DeleteFleet);
  });
});
