import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('appsync.amazonaws.com', () => {
  test('APPSYNC_CreateGraphqlApi', async () => {
    const event = await sendMessage(Events.APPSYNC_CreateGraphqlApi);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:appsync:ap-northeast-1:999999999999:apis/xj5oswqxnzdfrnhfa7vu33cbde');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APPSYNC_CreateGraphqlApi);
  });

  test('APPSYNC_DeleteGraphqlApi', async () => {
    const event = await sendMessage(Events.APPSYNC_DeleteGraphqlApi);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:appsync:ap-northeast-1:999999999999:apis/xj5oswqxnzdfrnhfa7vu33cbde');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APPSYNC_DeleteGraphqlApi);
  });
});
