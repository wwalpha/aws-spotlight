import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('network-firewall.amazonaws.com', () => {
  test('NFW_CreateFirewall', async () => {
    const event = await sendMessage(Events.NFW_CreateFirewall);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:network-firewall:ap-northeast-1:999999999999:firewall/Sjin6-Firewall');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.NFW_CreateFirewall);
  });

  test('NFW_DeleteFirewall', async () => {
    const event = await sendMessage(Events.NFW_DeleteFirewall);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:network-firewall:ap-northeast-1:999999999999:firewall/Sjin6-Firewall');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.NFW_DeleteFirewall);
  });
});
