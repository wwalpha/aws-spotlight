import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as TRANSFER from '@test/expect/transfer';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('transfer.amazonaws.com', () => {
  test('TRANSFER_CreateServer', async () => {
    const event = await sendMessage(CreateEvents.TRANSFER_CreateServer);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:transfer:ap-northeast-1:999999999999:server/s-61ada58e71d74f8da');
    const history = await getHistory({ EventId: '24a452f0-6d3b-497f-9f07-9d9f8b206b21' });

    // fs.writeFileSync('CreateServer_R.json', JSON.stringify(resource));
    // fs.writeFileSync('CreateServer_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(TRANSFER.CreateServer_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(TRANSFER.CreateServer_H);
  });

  test('TRANSFER_DeleteServer', async () => {
    const event = await sendMessage(DeleteEvents.TRANSFER_DeleteServer);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:transfer:ap-northeast-1:999999999999:server/s-61ada58e71d74f8da');
    const history = await getHistory({ EventId: 'dca119e2-0caa-42ad-b160-9d99303a0c83' });

    // fs.writeFileSync('DeleteServer_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(TRANSFER.DeleteServer_H);
  });
});
