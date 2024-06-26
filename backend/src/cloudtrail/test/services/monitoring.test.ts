import AWS from 'aws-sdk';
import { getHistory, getResource, scanResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as EXPECTS from '@test/expect/monitoring';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('monitoring.amazonaws.com', () => {
  test('MONITORING_PutMetricAlarm', async () => {
    const event = await sendMessage(CreateEvents.MONITORING_PutMetricAlarm);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudwatch:ap-northeast-1:999999999999:alarm:CloudWatch_Test08');

    const history = await getHistory({ EventId: '41c4b80b-f16b-4d79-8ce3-e69900d4dd22' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.PutMetricAlarm_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.PutMetricAlarm_H);
  });

  test('MONITORING_DeleteAlarms', async () => {
    const event = await sendMessage(DeleteEvents.MONITORING_DeleteAlarms);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudwatch:ap-northeast-1:999999999999:alarm:CloudWatch_Test08');
    const history = await getHistory({ EventId: '877eb4b7-a7d6-4eaf-9e59-9e22d8928f19' });

    // fs.writeFileSync('./test/expect/monitoring/MONITORING_DeleteAlarms_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/monitoring/MONITORING_DeleteAlarms_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.MONITORING_DeleteAlarms_R);
    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.MONITORING_DeleteAlarms_H);
  });

  test('MONITORING_PutDashboard', async () => {
    const event = await sendMessage(CreateEvents.MONITORING_PutDashboard);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudwatch::999999999999:dashboard/LambdaDashBoard');
    const history = await getHistory({ EventId: CreateEvents.MONITORING_PutDashboard.eventID });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.PutDashboard_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.PutDashboard_H);
  });

  test('MONITORING_DeleteDashboards', async () => {
    const event = await sendMessage(DeleteEvents.MONITORING_DeleteDashboards);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudwatch::999999999999:dashboard/LambdaDashBoard');
    const history = await getHistory({ EventId: DeleteEvents.MONITORING_DeleteDashboards.eventID });

    // fs.writeFileSync('./test/expect/monitoring/MONITORING_DeleteDashboards_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/monitoring/MONITORING_DeleteDashboards_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.MONITORING_DeleteDashboards_R);
    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.MONITORING_DeleteDashboards_H);
  });
});
