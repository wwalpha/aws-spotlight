import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('lex.amazonaws.com', () => {
  test('LEX_CreateBot', async () => {
    const event = await sendMessage(Events.LEX_CreateBot);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:lex:ap-northeast-1:999999999999:bot:multichannel_lex_bot');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.LEX_CreateBot);
  });

  test('LEX_DeleteBot', async () => {
    const event = await sendMessage(Events.LEX_DeleteBot);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:lex:ap-northeast-1:999999999999:bot:multichannel_lex_bot');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.LEX_DeleteBot);
  });
});
