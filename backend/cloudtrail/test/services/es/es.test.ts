import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('es.amazonaws.com', () => {
  test('ES_CreateElasticsearchDomain', async () => {
    const event = await sendMessage(Events.ES_CreateElasticsearchDomain);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:es:ap-northeast-1:999999999999:domain/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ES_CreateElasticsearchDomain);
  });

  test('ES_DeleteElasticsearchDomain', async () => {
    const event = await sendMessage(Events.ES_DeleteElasticsearchDomain);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:es:ap-northeast-1:999999999999:domain/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ES_DeleteElasticsearchDomain);
  });

  test('ES_CreateDomain', async () => {
    const event = await sendMessage(Events.ES_CreateDomain);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:es:ap-northeast-1:999999999999:domain/test2');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ES_CreateDomain);
  });

  test('ES_DeleteDomain', async () => {
    const event = await sendMessage(Events.ES_DeleteDomain);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:es:ap-northeast-1:999999999999:domain/test2');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ES_DeleteDomain);
  });
});
