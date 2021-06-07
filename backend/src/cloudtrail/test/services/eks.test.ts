import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as EKS from '@test/expect/eks';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('eks.amazonaws.com', () => {
  test('EKS_CreateCluster', async () => {
    const event = await sendMessage(CreateEvents.EKS_CreateCluster);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'eks.amazonaws.com',
      ResourceId: 'arn:aws:eks:ap-northeast-1:999999999999:cluster/eks-cluster',
    });
    const history = await getHistory({ EventId: 'efce27a7-201e-493c-a06d-beb6a9303987' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EKS.CreateCluster_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EKS.CreateCluster_H);
  });

  test('EKS_DeleteCluster', async () => {
    const event = await sendMessage(DeleteEvents.EKS_DeleteCluster);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'ec2.amazonaws.com',
      ResourceId: 'arn:aws:eks:ap-northeast-1:999999999999:cluster/eks-cluster',
    });
    const history = await getHistory({ EventId: '7b53a37a-6d75-4065-a34f-d009e0590e97' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EKS.DeleteCluster_H);
  });
});
