import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('batch.amazonaws.com', () => {
  test('BATCH_CreateComputeEnvironment', async () => {
    const event = await sendMessage(Events.BATCH_CreateComputeEnvironment);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:batch:ap-northeast-1:999999999999:compute-environment/first-run-compute-environment'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.BATCH_CreateComputeEnvironment);
  });

  test('BATCH_DeleteComputeEnvironment', async () => {
    const event = await sendMessage(Events.BATCH_DeleteComputeEnvironment);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:batch:ap-northeast-1:999999999999:compute-environment/first-run-compute-environment'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.BATCH_DeleteComputeEnvironment);
  });
});
