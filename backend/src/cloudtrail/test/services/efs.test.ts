import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as EFS from '@test/expect/efs';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('elasticfilesystem.amazonaws.com', () => {
  test('ELASTICFILESYSTEM_CreateFileSystem', async () => {
    const event = await sendMessage(CreateEvents.ELASTICFILESYSTEM_CreateFileSystem);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'elasticfilesystem.amazonaws.com', ResourceId: 'fs-d536f8f5' });
    const history = await getHistory({ EventId: 'f1969d29-ac0c-4a5e-8517-5733ff9ef57a' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EFS.CreateFileSystem_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EFS.CreateFileSystem_H);
  });

  test('ELASTICFILESYSTEM_DeleteFileSystem', async () => {
    const event = await sendMessage(DeleteEvents.ELASTICFILESYSTEM_DeleteFileSystem);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'elasticfilesystem.amazonaws.com', ResourceId: 'fs-d536f8f5' });
    const history = await getHistory({ EventId: '7def94c1-bdcb-4546-8856-89b59abe586d' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EFS.DeleteFileSystem_H);
  });
});
