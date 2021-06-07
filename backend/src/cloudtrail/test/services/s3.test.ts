import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import S3_CreateBucket from '../datas/create/S3_CreateBucket.json';
import S3_DeleteBucket from '../datas/delete/S3_DeleteBucket.json';

import { cloudtrail } from '@src/index';
import * as S3 from '@test/expect/s3';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('s3.amazonaws.com', () => {
  test('CreateBucket', async () => {
    const event = await sendMessage(S3_CreateBucket);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 's3.amazonaws.com',
      ResourceId: 'test-backt-testfile01',
    });
    const history = await getHistory({ EventId: '16ab98c7-8007-4df8-9722-9b1732fa7f78' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(S3.CreateBucket_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(S3.CreateBucket_H);
  });

  test('DeleteBucket', async () => {
    const event = await sendMessage(S3_DeleteBucket);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 's3.amazonaws.com', ResourceId: 'test-backt-testfile01' });
    const history = await getHistory({ EventId: '74167e6a-03ae-419a-94b1-387709ae56e2' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(S3.DeleteBucket_H);
  });
});
