import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './excepts';
import * as fs from 'fs';

describe('elasticfilesystem.amazonaws.com', () => {
  test('ELASTICFILESYSTEM_CreateFileSystem', async () => {
    const event = await sendMessage(Events.ELASTICFILESYSTEM_CreateFileSystem);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:elasticfilesystem:ap-northeast-1:999999999999:file-system/fs-d536f8f5');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ELASTICFILESYSTEM_CreateFileSystem);
  });

  test('ELASTICFILESYSTEM_DeleteFileSystem', async () => {
    const event = await sendMessage(Events.ELASTICFILESYSTEM_DeleteFileSystem);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:elasticfilesystem:ap-northeast-1:999999999999:file-system/fs-d536f8f5');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ELASTICFILESYSTEM_DeleteFileSystem);
  });

  test('ELASTICFILESYSTEM_CreateFileSystemForSagemaker', async () => {
    await cloudtrail(await sendMessage(Events.ELASTICFILESYSTEM_SAGEMAKER_CreateDomain));
    await cloudtrail(await sendMessage(Events.ELASTICFILESYSTEM_CreateFileSystemForSagemaker));

    const resource = await getResource(
      'arn:aws:elasticfilesystem:us-east-1:999999999999:file-system/fs-0a49146a8cb95e621'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ELASTICFILESYSTEM_CreateFileSystem);
  });
});
