import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as WAFV2 from '@test/expect/wafv2';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('wafv2.amazonaws.com', () => {
  test('WAFV2_CreateIPSet', async () => {
    const event = await sendMessage(CreateEvents.WAFV2_CreateIPSet);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:wafv2:ap-northeast-1:999999999999:regional/ipset/IPSET1/d555a554-74ee-45c3-bf98-466d1b992af2'
    );
    const history = await getHistory({ EventId: '994825f9-a888-4476-9119-7c433eaec82f' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(WAFV2.CreateIPSet_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(WAFV2.CreateIPSet_H);
  });

  test('WAFV2_DeleteIPSet', async () => {
    const event = await sendMessage(DeleteEvents.WAFV2_DeleteIPSet);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:wafv2:ap-northeast-1:999999999999:regional/ipset/IPSET1/d555a554-74ee-45c3-bf98-466d1b992af2'
    );
    const history = await getHistory({ EventId: '127eeb16-77c1-4617-9532-44b53cfa58e9' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(WAFV2.DeleteIPSet_H);
  });

  test('WAFV2_CreateWebACL', async () => {
    const event = await sendMessage(CreateEvents.WAFV2_CreateWebACL);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:wafv2:ap-northeast-1:999999999999:regional/webacl/test/0b36934b-95e3-42bc-8b21-55087a750a8d'
    );
    const history = await getHistory({ EventId: '71336c0b-fa3e-4d57-9097-22d89e645a97' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(WAFV2.CreateWebACL_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(WAFV2.CreateWebACL_H);
  });

  test('WAFV2_DeleteWebACL', async () => {
    const event = await sendMessage(DeleteEvents.WAFV2_DeleteWebACL);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:wafv2:ap-northeast-1:999999999999:regional/webacl/test/0b36934b-95e3-42bc-8b21-55087a750a8d'
    );
    const history = await getHistory({ EventId: 'c0aa8749-274f-4d75-bd45-97747862e382' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(WAFV2.DeleteWebACL_H);
  });
});
