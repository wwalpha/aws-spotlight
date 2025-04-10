import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './excepts';

describe('ecs.amazonaws.com', () => {
  test('ECS_CreateCluster', async () => {
    const event = await sendMessage(Events.ECS_CreateCluster);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ecs:ap-northeast-1:999999999999:cluster/arms-cluster');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ECS_CreateCluster);
  });

  test('ECS_DeleteCluster', async () => {
    const event = await sendMessage(Events.ECS_DeleteCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ecs:ap-northeast-1:999999999999:cluster/arms-cluster');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ECS_DeleteCluster);
  });

  test('ECS_CreateClusterForBatch', async () => {
    await cloudtrail(await sendMessage(Events.ECS_BATCH_CreateComputeEnvironment));
    await cloudtrail(await sendMessage(Events.ECS_CreateClusterForBatch));

    const resource = await getResource(
      'arn:aws:ecs:ap-northeast-1:999999999999:cluster/AWSBatch-getting-started-wizard-compute-env'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ECS_CreateClusterForBatch);
  });
});
