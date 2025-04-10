import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('dms.amazonaws.com', () => {
  test('DMS_CreateReplicationInstance', async () => {
    const event = await sendMessage(Events.DMS_CreateReplicationInstance);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:dms:ap-northeast-1:999999999999:rep:IMG2PDS3YLM3PFGOMBNEY7LMODJ2Q4YA5AMOJLA'
    );
    fs.writeFileSync('./expects/DMS_CreateReplicationInstance.json', JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.DMS_CreateReplicationInstance);
  });

  test('DMS_DeleteReplicationInstance', async () => {
    const event = await sendMessage(Events.DMS_DeleteReplicationInstance);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:dms:ap-northeast-1:999999999999:rep:IMG2PDS3YLM3PFGOMBNEY7LMODJ2Q4YA5AMOJLA'
    );
    fs.writeFileSync('./expects/DMS_DeleteReplicationInstance.json', JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.DMS_DeleteReplicationInstance);
  });
});
