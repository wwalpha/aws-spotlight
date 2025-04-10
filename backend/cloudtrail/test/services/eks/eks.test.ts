import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('eks.amazonaws.com', () => {
  test('EKS_CreateCluster', async () => {
    const event = await sendMessage(Events.EKS_CreateCluster);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:eks:ap-northeast-1:999999999999:cluster/eks-cluster');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EKS_CreateCluster);
  });

  test('EKS_DeleteCluster', async () => {
    const event = await sendMessage(Events.EKS_DeleteCluster);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:eks:ap-northeast-1:999999999999:cluster/eks-cluster');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EKS_DeleteCluster);
  });
});
