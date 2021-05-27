import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import ELASTICLOADBALANCING_CreateLoadBalancer from '../datas/create/ELASTICLOADBALANCING_CreateLoadBalancer.json';
import ELASTICLOADBALANCING_CreateTargetGroup from '../datas/create/ELASTICLOADBALANCING_CreateTargetGroup.json';
import ELASTICLOADBALANCING_DeleteLoadBalancer from '../datas/delete/ELASTICLOADBALANCING_DeleteLoadBalancer.json';
import ELASTICLOADBALANCING_DeleteTargetGroup from '../datas/delete/ELASTICLOADBALANCING_DeleteTargetGroup.json';

import { cloudtrail } from '@src/index';
import {
  CreateLoadBalancer_H,
  CreateLoadBalancer_R,
  CreateTargetGroup_H,
  CreateTargetGroup_R,
  DeleteLoadBalancer_H,
  DeleteTargetGroup_H,
} from '@test/expect/loadbalancer';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('elasticloadbalancing.amazonaws.com', () => {
  test('CreateLoadBalancer', async () => {
    const event = await sendMessage(ELASTICLOADBALANCING_CreateLoadBalancer);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'elasticloadbalancing.amazonaws.com',
      ResourceId:
        'arn:aws:elasticloadbalancing:ap-northeast-1:999999999999:loadbalancer/net/TESTflontback/813270f8ee6fa76a',
    });
    const history = await getHistory({ EventId: '009d103b-0d6e-4fc4-b35a-7f2cc315795f' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(CreateLoadBalancer_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(CreateLoadBalancer_H);
  });

  test('CreateTargetGroup', async () => {
    const event = await sendMessage(ELASTICLOADBALANCING_CreateTargetGroup);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'elasticloadbalancing.amazonaws.com',
      ResourceId:
        'arn:aws:elasticloadbalancing:ap-northeast-1:999999999999:targetgroup/TESTfontback-tgt/297bf72439f1364c',
    });
    const history = await getHistory({ EventId: '7b009e94-e6da-4ddb-ba7e-9019dfb67722' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(CreateTargetGroup_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(CreateTargetGroup_H);
  });

  test('DeleteLoadBalancer', async () => {
    const event = await sendMessage(ELASTICLOADBALANCING_DeleteLoadBalancer);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'apigateway.amazonaws.com',
      ResourceId:
        'arn:aws:elasticloadbalancing:ap-northeast-1:999999999999:loadbalancer/net/TESTflontback/813270f8ee6fa76a',
    });
    const history = await getHistory({ EventId: '46787bab-e6c6-4c49-b9c7-69bc0578a928' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(DeleteLoadBalancer_H);
  });

  test('DeleteTargetGroup', async () => {
    const event = await sendMessage(ELASTICLOADBALANCING_DeleteTargetGroup);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'elasticloadbalancing.amazonaws.com',
      ResourceId:
        'arn:aws:elasticloadbalancing:ap-northeast-1:999999999999:targetgroup/TESTfontback-tgt/297bf72439f1364c',
    });
    const history = await getHistory({ EventId: '0195aac9-8b72-4da5-b360-95c526363516' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(DeleteTargetGroup_H);
  });
});
