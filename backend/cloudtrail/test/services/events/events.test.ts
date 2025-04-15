import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('events.amazonaws.com', () => {
  test('EVENTS_CreateEventBus', async () => {
    const event = await sendMessage(Events.EVENTS_CreateEventBus);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:events:ap-northeast-1:999999999999:event-bus/data-mesh-bus');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EVENTS_CreateEventBus);
  });

  test('EVENTS_DeleteEventBus', async () => {
    const event = await sendMessage(Events.EVENTS_DeleteEventBus);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:events:ap-northeast-1:999999999999:event-bus/data-mesh-bus');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EVENTS_DeleteEventBus);
  });
});
