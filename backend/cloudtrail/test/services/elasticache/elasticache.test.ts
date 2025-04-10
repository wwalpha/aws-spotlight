import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
// import * as EXPECTS from './excepts';
import * as fs from 'fs';

describe('elasticache.amazonaws.com', () => {
  test('ELASTICACHE_CreateCacheCluster', async () => {
    const event = await sendMessage(Events.ELASTICACHE_CreateCacheCluster);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:elasticache:ap-northeast-1:999999999999:cluster:containersample-dev');
    fs.writeFileSync('./test/expect/simple/ELASTICACHE_CreateCacheCluster.json', JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.ELASTICACHE_CreateCacheCluster);
  });

  test('ELASTICACHE_DeleteCacheCluster', async () => {
    const event = await sendMessage(Events.ELASTICACHE_DeleteCacheCluster);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:elasticache:ap-northeast-1:999999999999:cluster:containersample-dev');
    fs.writeFileSync('./test/expect/simple/ELASTICACHE_DeleteCacheCluster.json', JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.ELASTICACHE_DeleteCacheCluster);
  });
});
