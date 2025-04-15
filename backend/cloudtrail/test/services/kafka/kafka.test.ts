import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('kafka.amazonaws.com', () => {
  test('KAFKA_CreateClusterV2', async () => {
    const event = await sendMessage(Events.KAFKA_CreateClusterV2);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:kafka:ap-northeast-1:999999999999:cluster/msk-cluster-hashimoto/50275221-135d-41d1-8004-2844259afa2d-s1'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.KAFKA_CreateClusterV2);
  });

  test('KAFKA_DeleteCluster', async () => {
    const event = await sendMessage(Events.KAFKA_DeleteCluster);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:kafka:ap-northeast-1:999999999999:cluster/msk-cluster-hashimoto/50275221-135d-41d1-8004-2844259afa2d-s1'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.KAFKA_DeleteCluster);
  });
});
