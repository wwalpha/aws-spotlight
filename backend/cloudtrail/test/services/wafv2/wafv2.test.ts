import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('wafv2.amazonaws.com', () => {
  test('WAFV2_CreateIPSet', async () => {
    const event = await sendMessage(Events.WAFV2_CreateIPSet);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:wafv2:ap-northeast-1:999999999999:regional/ipset/IPSET1');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.WAFV2_CreateIPSet);
  });

  test('WAFV2_DeleteIPSet', async () => {
    const event = await sendMessage(Events.WAFV2_DeleteIPSet);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:wafv2:ap-northeast-1:999999999999:regional/ipset/IPSET1');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.WAFV2_DeleteIPSet);
  });

  test('WAFV2_CreateWebACL', async () => {
    const event = await sendMessage(Events.WAFV2_CreateWebACL);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:wafv2:ap-northeast-1:999999999999:regional/webacl/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.WAFV2_CreateWebACL);
  });

  test('WAFV2_DeleteWebACL', async () => {
    const event = await sendMessage(Events.WAFV2_DeleteWebACL);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:wafv2:ap-northeast-1:999999999999:regional/webacl/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.WAFV2_DeleteWebACL);
  });
});
