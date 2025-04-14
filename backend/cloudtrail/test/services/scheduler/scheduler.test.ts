import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('scheduler.amazonaws.com', () => {
  test('SCHEDULER_CreateSchedule', async () => {
    const event = await sendMessage(Events.SCHEDULER_CreateSchedule);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:scheduler:ap-northeast-1:999999999999:schedule/default/EC2-Stop-i-06f8415851cf64313'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SCHEDULER_CreateSchedule);
  });

  test('SCHEDULER_DeleteSchedule', async () => {
    const event = await sendMessage(Events.SCHEDULER_DeleteSchedule);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:scheduler:ap-northeast-1:999999999999:schedule/default/EC2-Stop-i-06f8415851cf64313'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SCHEDULER_DeleteSchedule);
  });
});
