import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('airflow.amazonaws.com', () => {
  test('AIRFLOW_CreateEnvironment', async () => {
    const event = await sendMessage(Events.AIRFLOW_CreateEnvironment);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:airflow:ap-northeast-1:999999999999:environment/MyAirflowEnvironment');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.AIRFLOW_CreateEnvironment);
  });

  test('AIRFLOW_DeleteEnvironment', async () => {
    const event = await sendMessage(Events.AIRFLOW_DeleteEnvironment);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:airflow:ap-northeast-1:999999999999:environment/MyAirflowEnvironment');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.AIRFLOW_DeleteEnvironment);
  });
});
