import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('redshift.amazonaws.com', () => {
  test('REDSHIFT_CreateCluster', async () => {
    const event = await sendMessage(Events.REDSHIFT_CreateCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:redshift:us-east-1:999999999999:cluster:redshift-cluster-1');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.REDSHIFT_CreateCluster);
  });

  test('REDSHIFT_DeleteCluster', async () => {
    const event = await sendMessage(Events.REDSHIFT_DeleteCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:redshift:us-east-1:999999999999:cluster:redshift-cluster-1');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.REDSHIFT_DeleteCluster);
  });
});
