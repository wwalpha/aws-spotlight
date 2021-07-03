import AWS from 'aws-sdk';
import { getHistory, getResource, scanResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as ROUTE53 from '@test/expect/route53';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('route53.amazonaws.com', () => {
  test('ROUTE53_CreateHostedZone', async () => {
    const event = await sendMessage(CreateEvents.ROUTE53_CreateHostedZone);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:route53:::hostedzone/AAAAAAAAAAAAAAAA');
    const history = await getHistory({ EventId: '1ef16a91-e677-4c56-936f-6bc68516b96a' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(ROUTE53.CreateHostedZone_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(ROUTE53.CreateHostedZone_H);
  });

  test('ROUTE53_DeleteHostedZone', async () => {
    const event = await sendMessage(DeleteEvents.ROUTE53_DeleteHostedZone);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:route53:::hostedzone/AAAAAAAAAAAAAAAA');
    const history = await getHistory({ EventId: '0528df1d-ea4c-4046-9ed7-11967e0ecb0c' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(ROUTE53.DeleteHostedZone_H);
  });
});
