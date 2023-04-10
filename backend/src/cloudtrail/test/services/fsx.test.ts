import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as EXPECTS from '@test/expect/fsx';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('fsx.amazonaws.com', () => {
  test('FSX_CreateFileSystem', async () => {
    const event = await sendMessage(CreateEvents.FSX_CreateFileSystem);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:fsx:ap-northeast-1:999999999999:file-system/fs-01975f073c6852d99');
    const history = await getHistory({ EventId: CreateEvents.FSX_CreateFileSystem.eventID });

    // fs.writeFileSync('./test/expect/fsx/FSX_CreateFileSystem_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/fsx/FSX_CreateFileSystem_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.FSX_CreateFileSystem_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.FSX_CreateFileSystem_H);
  });

  test('FSX_DeleteFileSystem', async () => {
    const event = await sendMessage(DeleteEvents.FSX_DeleteFileSystem);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:fsx:ap-northeast-1:999999999999:file-system/fs-01975f073c6852d99');
    const history = await getHistory({ EventId: DeleteEvents.FSX_DeleteFileSystem.eventID });

    // fs.writeFileSync('./test/expect/fsx/FSX_DeleteFileSystem_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.FSX_DeleteFileSystem_H);
  });
});
