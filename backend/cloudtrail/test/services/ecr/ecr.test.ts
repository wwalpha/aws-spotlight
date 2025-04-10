import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('ecr.amazonaws.com', () => {
  test('ECR_CreateRepository', async () => {
    const event = await sendMessage(Events.ECR_CreateRepository);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ecr:ap-northeast-1:999999999999:repository/nodejs-blue');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ECR_CreateRepository);
  });

  test('ECR_DeleteRepository', async () => {
    const event = await sendMessage(Events.ECR_DeleteRepository);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ecr:ap-northeast-1:999999999999:repository/nodejs-blue');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ECR_DeleteRepository);
  });
});
