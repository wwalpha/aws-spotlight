import AWS from 'aws-sdk';
import { getHistory, getResource, scanResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as REDSHIFT from '@test/expect/redshift';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('redshift.amazonaws.com', () => {
  test('REDSHIFT_CreateCluster', async () => {
    const event = await sendMessage(CreateEvents.REDSHIFT_CreateCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:redshift:us-east-1:999999999999:cluster:redshift-cluster-1');
    const history = await getHistory({ EventId: '54677ea0-d177-495e-b418-5d7a84942d70' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(REDSHIFT.CreateCluster_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(REDSHIFT.CreateCluster_H);
  });

  test('REDSHIFT_DeleteCluster', async () => {
    const event = await sendMessage(DeleteEvents.REDSHIFT_DeleteCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:redshift:us-east-1:999999999999:cluster:redshift-cluster-1');
    const history = await getHistory({ EventId: 'e0fb538c-f822-4557-92bd-d60f1220058c' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(REDSHIFT.DeleteCluster_H);
  });
});
