import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('route53.amazonaws.com', () => {
  test('ROUTE53_CreateHostedZone', async () => {
    const event = await sendMessage(Events.ROUTE53_CreateHostedZone);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:route53:::hostedzone/AAAAAAAAAAAAAAAA');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ROUTE53_CreateHostedZone);
  });

  test('ROUTE53_DeleteHostedZone', async () => {
    const event = await sendMessage(Events.ROUTE53_DeleteHostedZone);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:route53:::hostedzone/AAAAAAAAAAAAAAAA');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ROUTE53_DeleteHostedZone);
  });
});
