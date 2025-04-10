import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

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
});
