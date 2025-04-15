import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('grafana.amazonaws.com', () => {
  test('GRAFANA_CreateWorkspace', async () => {
    const event = await sendMessage(Events.GRAFANA_CreateWorkspace);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:grafana:ap-northeast-1:999999999999:/workspaces/g-e108f16930');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.GRAFANA_CreateWorkspace);
  });

  test('GRAFANA_DeleteWorkspace', async () => {
    const event = await sendMessage(Events.GRAFANA_DeleteWorkspace);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:grafana:ap-northeast-1:999999999999:/workspaces/g-e108f16930');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.GRAFANA_DeleteWorkspace);
  });
});
