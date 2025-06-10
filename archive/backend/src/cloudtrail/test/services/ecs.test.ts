import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as EXPECTS from '@test/expect/ecs';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('ecs.amazonaws.com', () => {
  test('ECS_CreateCluster', async () => {
    const event = await sendMessage(CreateEvents.ECS_CreateCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ecs:ap-northeast-1:999999999999:cluster/arms-cluster');
    const history = await getHistory({ EventId: CreateEvents.ECS_CreateCluster.eventID });

    // fs.writeFileSync('./test/expect/ecs/ECS_CreateCluster_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/ecs/ECS_CreateCluster_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ECS_CreateCluster_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.ECS_CreateCluster_H);
  });

  test('ECS_DeleteCluster', async () => {
    const event = await sendMessage(DeleteEvents.ECS_DeleteCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ecs:ap-northeast-1:999999999999:cluster/arms-cluster');
    const history = await getHistory({ EventId: DeleteEvents.ECS_DeleteCluster.eventID });

    // fs.writeFileSync('./test/expect/ecs/ECS_DeleteCluster_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.ECS_DeleteCluster_H);
  });
});
