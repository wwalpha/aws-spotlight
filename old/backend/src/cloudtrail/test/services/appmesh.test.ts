import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as APPMESH from '@test/expect/appmesh';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('appmesh.amazonaws.com', () => {
  test('APPMESH_CreateMesh', async () => {
    const event = await sendMessage(CreateEvents.APPMESH_CreateMesh);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:appmesh:ap-northeast-1:999999999999:mesh/test_mesh');
    const history = await getHistory({ EventId: '0e67a61b-16b4-45cb-be48-984529c26d40' });

    fs.writeFileSync('./test/expect/appmesh/APPMESH_CreateMesh_R.json', JSON.stringify(resource));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(APPMESH.CreateMesh_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(APPMESH.CreateMesh_H);
  });

  test('APPMESH_DeleteMesh', async () => {
    const event = await sendMessage(DeleteEvents.APPMESH_DeleteMesh);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:appmesh:ap-northeast-1:999999999999:mesh/test_mesh');
    const history = await getHistory({ EventId: '56c21bc7-2eff-4e2c-9c1d-d63e8538612d' });

    fs.writeFileSync('./test/expect/appmesh/APPMESH_DeleteMesh_R.json', JSON.stringify(resource));

    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(APPMESH.APPMESH_DeleteMesh_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(APPMESH.DeleteMesh_H);
  });
});
