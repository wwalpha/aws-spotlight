import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('networkmonitor.amazonaws.com', () => {
  test('NETWORKMONITOR_CreateMonitor', async () => {
    const event = await sendMessage(Events.NETWORKMONITOR_CreateMonitor);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:networkmonitor:ap-northeast-1:999999999999:monitor/zdp-webserver04-monitor'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.NETWORKMONITOR_CreateMonitor);
  });

  test('NETWORKMONITOR_DeleteMonitor', async () => {
    const event = await sendMessage(Events.NETWORKMONITOR_DeleteMonitor);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:networkmonitor:ap-northeast-1:999999999999:monitor/zdp-webserver04-monitor'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.NETWORKMONITOR_DeleteMonitor);
  });
});
