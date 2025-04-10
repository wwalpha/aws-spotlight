import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

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
});
