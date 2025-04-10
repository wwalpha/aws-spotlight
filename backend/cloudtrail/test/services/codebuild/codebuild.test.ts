import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('codebuild.amazonaws.com', () => {
  test('CODEBUILD_CreateProject', async () => {
    const event = await sendMessage(Events.CODEBUILD_CreateProject);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:codebuild:ap-northeast-1:999999999999:project/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEBUILD_CreateProject);
  });

  test('CODEBUILD_DeleteProject', async () => {
    const event = await sendMessage(Events.CODEBUILD_DeleteProject);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:codebuild:ap-northeast-1:999999999999:project/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEBUILD_DeleteProject);
  });
});
