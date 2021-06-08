import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as EC2 from '@test/expect/ec2';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('ec2.amazonaws.com', () => {
  test('EC2_RunInstances', async () => {
    const event = await sendMessage(CreateEvents.EC2_RunInstances);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'i-0fc5d99558e8357e8' });
    const history = await getHistory({ EventId: 'a5848021-7469-441a-8f2e-f7aa5b61a46b' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.RunInstances_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.RunInstances_H);
  });

  test('EC2_TerminateInstances', async () => {
    const event = await sendMessage(DeleteEvents.EC2_TerminateInstances);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'i-0fc5d99558e8357e8' });
    const history = await getHistory({ EventId: '1c9916ba-eb47-4d50-8104-6901bc67a17d' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.TerminateInstances_H);
  });

  test('EC2_CreateImage', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateImage);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'ami-094a52a9a2b58d074' });
    const history = await getHistory({ EventId: 'a789df4b-2551-46c1-ac94-fff16a3d0b43' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateImage_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateImage_H);
  });

  test('EC2_DeregisterImage', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeregisterImage);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'ami-094a52a9a2b58d074' });
    const history = await getHistory({ EventId: 'e8da5c18-a3dc-4218-bc77-a721c3f6218c' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeregisterImage_H);
  });

  test('EC2_CreateSnapshot', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateSnapshot);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'snap-04233f8a0017f5a77' });
    const history = await getHistory({ EventId: '2fa6c467-0897-46c4-b9ff-7be10f73bb5c' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateSnapshot_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateSnapshot_H);
  });

  test('EC2_CreateSnapshots', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateSnapshots);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'snap-0ea8b3632c0ff21d6' });
    const history = await getHistory({ EventId: '874f5a46-560b-4e77-81b7-441837c3399c' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateSnapshots_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateSnapshots_H);
  });

  test('EC2_DeleteSnapshot', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteSnapshot);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'snap-0ea8b3632c0ff21d6' });
    const history = await getHistory({ EventId: 'fdd36f8d-946c-4731-93f1-c4918d13580d' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteSnapshot_H);
  });

  test('EC2_CreateNatGateway', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateNatGateway);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'nat-0cb758692bd70f8e6' });
    const history = await getHistory({ EventId: 'efc3dd39-f22b-4c25-8b7c-7d8b35ce8182' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateNatGateway_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateNatGateway_H);
  });

  test('EC2_DeleteNatGateway', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteNatGateway);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'nat-0cb758692bd70f8e6' });
    const history = await getHistory({ EventId: '178a7cbd-de61-49f7-bd54-ad61d7f62a89' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteNatGateway_H);
  });

  test('EC2_CreateClientVpnEndpoint', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateClientVpnEndpoint);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'ec2.amazonaws.com',
      ResourceId: 'cvpn-endpoint-00979964d0389482a',
    });
    const history = await getHistory({ EventId: 'daa11b60-20df-48d9-a406-aeae3c339e9b' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateClientVpnEndpoint_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateClientVpnEndpoint_H);
  });

  test('EC2_DeleteClientVpnEndpoint', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteClientVpnEndpoint);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'ec2.amazonaws.com',
      ResourceId: 'cvpn-endpoint-00979964d0389482a',
    });
    const history = await getHistory({ EventId: '52240267-bf17-470c-8df3-245fb7139217' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteClientVpnEndpoint_H);
  });

  test('EC2_CreateVpcPeeringConnection', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateVpcPeeringConnection);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'ec2.amazonaws.com',
      ResourceId: 'pcx-09cc395f56ffead9e',
    });
    const history = await getHistory({ EventId: '73bfa272-16c5-49c8-8d5f-ecea11f04060' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateVpcPeeringConnection_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateVpcPeeringConnection_H);
  });

  test('EC2_DeleteVpcPeeringConnection', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteVpcPeeringConnection);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'ec2.amazonaws.com',
      ResourceId: 'pcx-09cc395f56ffead9e',
    });
    const history = await getHistory({ EventId: 'cfde640d-77a8-4150-8eeb-f4627fbf55b7' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteVpcPeeringConnection_H);
  });
});
