import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('cloudfront.amazonaws.com', () => {
  test('CLOUDFRONT_CreateDistribution', async () => {
    const event = await sendMessage(Events.CLOUDFRONT_CreateDistribution);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudfront::999999999999:distribution/E1AU9D0469FO98');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CLOUDFRONT_CreateDistribution);
  });

  test('CLOUDFRONT_DeleteDistribution', async () => {
    const event = await sendMessage(Events.CLOUDFRONT_DeleteDistribution);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudfront::999999999999:distribution/E1AU9D0469FO98');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CLOUDFRONT_DeleteDistribution);
  });

  test('CLOUDFRONT_CreateFunction', async () => {
    const event = await sendMessage(Events.CLOUDFRONT_CreateFunction);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudfront::999999999999:function/cloudwatch-tools-basic-auth');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CLOUDFRONT_CreateFunction);
  });

  test('CLOUDFRONT_DeleteFunction', async () => {
    const event = await sendMessage(Events.CLOUDFRONT_DeleteFunction);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudfront::999999999999:function/cloudwatch-tools-basic-auth');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CLOUDFRONT_DeleteFunction);
  });
});
