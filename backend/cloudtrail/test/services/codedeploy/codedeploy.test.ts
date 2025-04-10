import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('codedeploy.amazonaws.com', () => {
  test('CODEDEPLOY_CreateApplication', async () => {
    const event = await sendMessage(Events.CODEDEPLOY_CreateApplication);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:codedeploy:ap-northeast-1:999999999999:application/Nodejs');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEDEPLOY_CreateApplication);
  });

  test('CODEDEPLOY_DeleteApplication', async () => {
    const event = await sendMessage(Events.CODEDEPLOY_DeleteApplication);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:codedeploy:ap-northeast-1:999999999999:application/Nodejs');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEDEPLOY_DeleteApplication);
  });
});
