import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('apprunner.amazonaws.com', () => {
  test('APPRUNNER_CreateService', async () => {
    const event = await sendMessage(Events.APPRUNNER_CreateService);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:apprunner:ap-northeast-1:999999999999:service/ikeda-guild-chat-server/29a93580983c4c8ab5489607bdaab024'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APPRUNNER_CreateService);
  });

  test('APPRUNNER_DeleteService', async () => {
    const event = await sendMessage(Events.APPRUNNER_DeleteService);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:apprunner:ap-northeast-1:999999999999:service/ikeda-guild-chat-server/29a93580983c4c8ab5489607bdaab024'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APPRUNNER_DeleteService);
  });
});
