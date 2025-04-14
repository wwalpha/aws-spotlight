import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('monitoring.amazonaws.com', () => {
  test('MONITORING_PutMetricAlarm', async () => {
    const event = await sendMessage(Events.MONITORING_PutMetricAlarm);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudwatch:ap-northeast-1:999999999999:alarm:demo0384-httpd-process');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.MONITORING_PutMetricAlarm);
  });

  test('MONITORING_DeleteAlarms', async () => {
    const event = await sendMessage(Events.MONITORING_DeleteAlarms);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudwatch:ap-northeast-1:999999999999:alarm:demo0384-httpd-process');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.MONITORING_DeleteAlarms);
  });

  test('MONITORING_PutDashboard', async () => {
    const event = await sendMessage(Events.MONITORING_PutDashboard);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudwatch:ap-northeast-1:999999999999:dashboard/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.MONITORING_PutDashboard);
  });

  test('MONITORING_DeleteDashboards', async () => {
    const event = await sendMessage(Events.MONITORING_DeleteDashboards);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudwatch:ap-northeast-1:999999999999:dashboard/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.MONITORING_DeleteDashboards);
  });
});
