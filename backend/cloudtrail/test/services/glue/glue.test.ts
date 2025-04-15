import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('glue.amazonaws.com', () => {
  test('GLUE_CreateDatabase', async () => {
    const event = await sendMessage(Events.GLUE_CreateDatabase);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:glue:ap-northeast-1:999999999999:database/dar-database');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.GLUE_CreateDatabase);
  });

  test('GLUE_DeleteDatabase', async () => {
    const event = await sendMessage(Events.GLUE_DeleteDatabase);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:glue:ap-northeast-1:999999999999:database/dar-database');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.GLUE_DeleteDatabase);
  });

  test('GLUE_CreateCrawler', async () => {
    const event = await sendMessage(Events.GLUE_CreateCrawler);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:glue:ap-northeast-1:999999999999:database/dar-database');
    fs.writeFileSync(path.join(__dirname, './expects/GLUE_CreateCrawler.json'), JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.GLUE_CreateCrawler);
  });

  test('GLUE_DeleteCrawler', async () => {
    const event = await sendMessage(Events.GLUE_DeleteCrawler);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:glue:ap-northeast-1:999999999999:database/dar-database');
    fs.writeFileSync(path.join(__dirname, './expects/GLUE_DeleteCrawler.json'), JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.GLUE_DeleteCrawler);
  });
});
