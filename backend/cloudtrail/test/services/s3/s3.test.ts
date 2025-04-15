import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('s3.amazonaws.com', () => {
  test('CreateBucket', async () => {
    const event = await sendMessage(Events.S3_CreateBucket);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:s3:::test-backt-testfile01');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.S3_CreateBucket);
  });

  test('DeleteBucket', async () => {
    const event = await sendMessage(Events.S3_DeleteBucket);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:s3:::test-backt-testfile01');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.S3_DeleteBucket);
  });
});

describe('s3express.amazonaws.com', () => {
  test('S3EXPRESS_CreateBucket', async () => {
    const event = await sendMessage(Events.S3EXPRESS_CreateBucket);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:s3:::test-zhiyuanpan--apne1-az4--x-s3');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.S3EXPRESS_CreateBucket);
  });

  test('S3EXPRESS_DeleteBucket', async () => {
    const event = await sendMessage(Events.S3EXPRESS_DeleteBucket);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:s3:::test-zhiyuanpan--apne1-az4--x-s3');

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.S3EXPRESS_DeleteBucket);
  });
});
