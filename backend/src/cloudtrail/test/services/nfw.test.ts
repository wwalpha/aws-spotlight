import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as NFW from '@test/expect/nfw';
import { cloudtrail } from '@src/index';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('network-firewall.amazonaws.com', () => {
  test('NFW_CreateFirewall', async () => {
    const event = await sendMessage(CreateEvents.NFW_CreateFirewall);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:network-firewall:ap-northeast-1:999999999999:firewall/Sjin6-Firewall');
    const history = await getHistory({ EventId: '8c01c1c4-e6c9-4501-bf4d-cc0aa93ce2e6' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(NFW.CreateFirewall_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(NFW.CreateFirewall_H);
  });

  test('NFW_DeleteFirewall', async () => {
    const event = await sendMessage(DeleteEvents.NFW_DeleteFirewall);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:network-firewall:ap-northeast-1:999999999999:firewall/Sjin6-Firewall');
    const history = await getHistory({ EventId: '21e7ced6-a8ea-4abf-9dfc-9fb0e3553348' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(NFW.DeleteFirewall_H);
  });
});
