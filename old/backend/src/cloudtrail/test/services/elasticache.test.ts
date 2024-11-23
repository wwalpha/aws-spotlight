import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as EXPECTS from '@test/expect/elasticache';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('elasticache.amazonaws.com', () => {
  test('ELASTICACHE_CreateCacheCluster', async () => {
    const event = await sendMessage(CreateEvents.ELASTICACHE_CreateCacheCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:elasticache:ap-northeast-1:999999999999:cluster:containersample-dev');
    const history = await getHistory({ EventId: CreateEvents.ELASTICACHE_CreateCacheCluster.eventID });

    fs.writeFileSync('./test/expect/elasticache/ELASTICACHE_CreateCacheCluster_R.json', JSON.stringify(resource));
    fs.writeFileSync('./test/expect/elasticache/ELASTICACHE_CreateCacheCluster_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.ELASTICACHE_CreateCacheCluster_R);

    expect(history).not.toBeUndefined();
    // expect(history).toEqual(EXPECTS.ELASTICACHE_CreateCacheCluster_H);
  });

  test('ELASTICACHE_DeleteCacheCluster', async () => {
    const event = await sendMessage(DeleteEvents.ELASTICACHE_DeleteCacheCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:elasticache:ap-northeast-1:999999999999:cluster:containersample-dev');
    const history = await getHistory({ EventId: DeleteEvents.ELASTICACHE_DeleteCacheCluster.eventID });

    // fs.writeFileSync('./test/expect/elasticache/ELASTICACHE_DeleteCacheCluster_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.ELASTICACHE_DeleteCacheCluster_H);
  });

  test('ELASTICACHE_CreateCacheSubnetGroup', async () => {
    const event = await sendMessage(CreateEvents.ELASTICACHE_CreateCacheSubnetGroup);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:elasticache:ap-northeast-1:999999999999:subnetgroup:containersample-dev-redis'
    );
    const history = await getHistory({ EventId: CreateEvents.ELASTICACHE_CreateCacheSubnetGroup.eventID });

    // fs.writeFileSync('./test/expect/elasticache/ELASTICACHE_CreateCacheSubnetGroup_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/elasticache/ELASTICACHE_CreateCacheSubnetGroup_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ELASTICACHE_CreateCacheSubnetGroup_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.ELASTICACHE_CreateCacheSubnetGroup_H);
  });

  test('ELASTICACHE_DeleteCacheSubnetGroup', async () => {
    const event = await sendMessage(DeleteEvents.ELASTICACHE_DeleteCacheSubnetGroup);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:elasticache:ap-northeast-1:999999999999:subnetgroup:containersample-dev-redis'
    );
    const history = await getHistory({ EventId: DeleteEvents.ELASTICACHE_DeleteCacheSubnetGroup.eventID });

    // fs.writeFileSync('./test/expect/elasticache/ELASTICACHE_DeleteCacheSubnetGroup_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.ELASTICACHE_DeleteCacheSubnetGroup_H);
  });
});
