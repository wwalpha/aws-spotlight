import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('codepipeline.amazonaws.com', () => {
  test('CODEPIPELINE_CreatePipeline', async () => {
    const event = await sendMessage(Events.CODEPIPELINE_CreatePipeline);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:codepipeline:ap-northeast-1:999999999999:cdcd_pipleline_testv1');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEPIPELINE_CreatePipeline);
  });

  test('CODEPIPELINE_DeletePipeline', async () => {
    const event = await sendMessage(Events.CODEPIPELINE_DeletePipeline);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:codepipeline:ap-northeast-1:999999999999:cdcd_pipleline_testv1');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEPIPELINE_DeletePipeline);
  });
});
