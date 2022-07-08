import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as DMS from '@test/expect/dms';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('dms.amazonaws.com', () => {
  test('DMS_CreateReplicationInstance', async () => {
    const event = await sendMessage(CreateEvents.DMS_CreateReplicationInstance);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:dms:ap-northeast-1:999999999999:rep:IMG2PDS3YLM3PFGOMBNEY7LMODJ2Q4YA5AMOJLA'
    );
    const history = await getHistory({ EventId: 'f0e00796-9fe0-40f7-81ec-b8538f172176' });

    // fs.writeFileSync('CreateReplicationInstance_R.json', JSON.stringify(resource));
    // fs.writeFileSync('CreateReplicationInstance_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(DMS.CreateReplicationInstance_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(DMS.CreateReplicationInstance_H);
  });

  test('DMS_DeleteReplicationInstance', async () => {
    const event = await sendMessage(DeleteEvents.DMS_DeleteReplicationInstance);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:dms:ap-northeast-1:999999999999:rep:4ZAYL4IJJETLZSQDIIKLFYL6L52NT6FR2QH6LTA'
    );
    const history = await getHistory({ EventId: 'fbb11b4f-9253-4014-9a3c-fdbb67b640cb' });

    // fs.writeFileSync('DeleteReplicationInstance_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(DMS.DeleteReplicationInstance_H);
  });
});
