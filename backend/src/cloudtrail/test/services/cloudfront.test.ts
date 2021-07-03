import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as CLOUDFRONT from '@test/expect/cloudfront';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('cloudfront.amazonaws.com', () => {
  test('CLOUDFRONT_CreateDistribution', async () => {
    const event = await sendMessage(CreateEvents.CLOUDFRONT_CreateDistribution);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudfront::999999999999:distribution/E1AU9D0469FO98');
    const history = await getHistory({ EventId: 'cedc7217-e137-4046-a23b-87371b9cc0ee' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(CLOUDFRONT.CreateDistribution_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(CLOUDFRONT.CreateDistribution_H);
  });

  test('CLOUDFRONT_DeleteDistribution', async () => {
    const event = await sendMessage(DeleteEvents.CLOUDFRONT_DeleteDistribution);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudfront::999999999999:distribution/E1AU9D0469FO98');
    const history = await getHistory({ EventId: '8853f4c6-cbd1-408d-addc-4f6591b07514' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(CLOUDFRONT.DeleteDistribution_H);
  });
});
