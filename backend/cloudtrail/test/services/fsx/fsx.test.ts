import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('fsx.amazonaws.com', () => {
  test('FSX_CreateFileSystem', async () => {
    const event = await sendMessage(Events.FSX_CreateFileSystem);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:fsx:ap-northeast-1:999999999999:file-system/fs-01975f073c6852d99');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.FSX_CreateFileSystem);
  });

  test('FSX_DeleteFileSystem', async () => {
    const event = await sendMessage(Events.FSX_DeleteFileSystem);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:fsx:ap-northeast-1:999999999999:file-system/fs-01975f073c6852d99');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.FSX_DeleteFileSystem);
  });
});
