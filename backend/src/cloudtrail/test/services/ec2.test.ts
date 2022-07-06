import AWS from 'aws-sdk';
import { getHistory, getResource, scanResource, sendMessage } from '@test/configs/utils';
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

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:instance/i-0fc5d99558e8357e8');
    const history = await getHistory({ EventId: 'a5848021-7469-441a-8f2e-f7aa5b61a46b' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.RunInstances_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.RunInstances_H);
  });

  test('EC2_TerminateInstances', async () => {
    const event = await sendMessage(DeleteEvents.EC2_TerminateInstances);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:instance/i-0fc5d99558e8357e8');
    const history = await getHistory({ EventId: '1c9916ba-eb47-4d50-8104-6901bc67a17d' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.TerminateInstances_H);
  });

  test('EC2_CreateImage', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateImage);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1::image/ami-094a52a9a2b58d074');
    const history = await getHistory({ EventId: 'a789df4b-2551-46c1-ac94-fff16a3d0b43' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateImage_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateImage_H);
  });

  test('EC2_DeregisterImage', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeregisterImage);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1::image/ami-094a52a9a2b58d074');
    const history = await getHistory({ EventId: 'e8da5c18-a3dc-4218-bc77-a721c3f6218c' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeregisterImage_H);
  });

  test('EC2_CreateSnapshot', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateSnapshot);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1::snapshot/snap-04233f8a0017f5a77');
    const history = await getHistory({ EventId: '2fa6c467-0897-46c4-b9ff-7be10f73bb5c' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateSnapshot_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateSnapshot_H);
  });

  test('EC2_CreateSnapshots', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateSnapshots);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1::snapshot/snap-0ea8b3632c0ff21d6');
    const history = await getHistory({ EventId: '874f5a46-560b-4e77-81b7-441837c3399c' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateSnapshots_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateSnapshots_H);
  });

  test('EC2_DeleteSnapshot', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteSnapshot);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1::snapshot/snap-0ea8b3632c0ff21d6');
    const history = await getHistory({ EventId: 'fdd36f8d-946c-4731-93f1-c4918d13580d' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteSnapshot_H);
  });

  test('EC2_CreateNatGateway', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateNatGateway);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:natgateway/nat-0cb758692bd70f8e6');
    const history = await getHistory({ EventId: 'efc3dd39-f22b-4c25-8b7c-7d8b35ce8182' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateNatGateway_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateNatGateway_H);
  });

  test('EC2_DeleteNatGateway', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteNatGateway);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:natgateway/nat-0cb758692bd70f8e6');
    const history = await getHistory({ EventId: '178a7cbd-de61-49f7-bd54-ad61d7f62a89' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteNatGateway_H);
  });

  test('EC2_CreateClientVpnEndpoint', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateClientVpnEndpoint);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:client-vpn-endpoint/cvpn-endpoint-00979964d0389482a'
    );
    const history = await getHistory({ EventId: 'daa11b60-20df-48d9-a406-aeae3c339e9b' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateClientVpnEndpoint_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateClientVpnEndpoint_H);
  });

  test('EC2_DeleteClientVpnEndpoint', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteClientVpnEndpoint);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:vpc-endpoint/cvpn-endpoint-00979964d0389482a'
    );
    const history = await getHistory({ EventId: '52240267-bf17-470c-8df3-245fb7139217' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteClientVpnEndpoint_H);
  });

  test('EC2_CreateVpcPeeringConnection', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateVpcPeeringConnection);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:vpc-peering-connection/pcx-09cc395f56ffead9e'
    );
    const history = await getHistory({ EventId: '73bfa272-16c5-49c8-8d5f-ecea11f04060' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateVpcPeeringConnection_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateVpcPeeringConnection_H);
  });

  test('EC2_DeleteVpcPeeringConnection', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteVpcPeeringConnection);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:vpc-peering-connection/pcx-09cc395f56ffead9e'
    );
    const history = await getHistory({ EventId: 'cfde640d-77a8-4150-8eeb-f4627fbf55b7' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteVpcPeeringConnection_H);
  });

  test('EC2_CreateVpc', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateVpc);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpc/vpc-0bda49e0068536141');
    const history = await getHistory({ EventId: '620937da-67fd-424a-ad7c-be3a5c519979' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateVpc_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateVpc_H);
  });

  test('EC2_DeleteVpc', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteVpc);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpc/vpc-0bda49e0068536141');
    const history = await getHistory({ EventId: '6bef224f-75de-446b-aa16-34029a7bc641' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteVpc_H);
  });

  test('EC2_CreateVolume', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateVolume);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:volume/vol-084879c77b49adac0');
    const history = await getHistory({ EventId: '925c1fe9-214f-41e0-b856-c55b76d254e7' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateVolume_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateVolume_H);
  });

  test('EC2_DeleteVolume', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteVolume);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:volume/vol-084879c77b49adac0');
    const history = await getHistory({ EventId: '1cd49a17-061e-478b-ad90-a36274a30037' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteVolume_H);
  });

  test('EC2_CreateVpcEndpoint', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateVpcEndpoint);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpc-endpoint/vpce-0ef9277730bf26b70');
    const history = await getHistory({ EventId: 'a3dc47d9-6d40-45da-b496-a435083c68bc' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateVpcEndpoint_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateVpcEndpoint_H);
  });

  test('EC2_DeleteVpcEndpoints', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteVpcEndpoints);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpc-endpoint/vpce-0ef9277730bf26b70');
    const history = await getHistory({ EventId: '325e694c-c7d7-45d8-8d5b-134922b5e495' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteVpcEndpoints_H);
  });

  test('EC2_AllocateAddress', async () => {
    const event = await sendMessage(CreateEvents.EC2_AllocateAddress);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:elastic-ip/eipalloc-044e12137f28d65f6');
    const history = await getHistory({ EventId: 'a44d0058-6b4c-4aec-b904-e68941e145dc' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.AllocateAddress_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.AllocateAddress_H);
  });

  test('EC2_ReleaseAddress', async () => {
    const event = await sendMessage(DeleteEvents.EC2_ReleaseAddress);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:elastic-ip/eipalloc-044e12137f28d65f6');
    const history = await getHistory({ EventId: '84c6084c-4746-4730-b36d-0ff2f83e5f85' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.ReleaseAddress_H);
  });

  test('EC2_CreateCustomerGateway', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateCustomerGateway);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:customer-gateway/cgw-0bf90d6d3825b7bbd'
    );
    const history = await getHistory({ EventId: '2a68939c-27ad-4e38-9ae4-532777b0900f' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateCustomerGateway_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateCustomerGateway_H);
  });

  test('EC2_DeleteCustomerGateway', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteCustomerGateway);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:customer-gateway/cgw-0bf90d6d3825b7bbd'
    );
    const history = await getHistory({ EventId: '301c5afc-4502-4da2-99ae-692445d85c22' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteCustomerGateway_H);
  });

  test('EC2_CreateVpnConnection', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateVpnConnection);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpn-connection/vpn-06d78c43438fa98fe');
    const history = await getHistory({ EventId: 'c19e8892-4ff6-4fc7-9147-e1fa34e0a3e8' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateVpnConnection_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateVpnConnection_H);
  });

  test('EC2_DeleteVpnConnection', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteVpnConnection);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpn-connection/vpn-06d78c43438fa98fe');
    const history = await getHistory({ EventId: '22278e71-190b-499a-8792-e9324e13e78b' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteVpnConnection_H);
  });

  test('EC2_CreateVpnGateway', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateVpnGateway);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpn-gateway/vgw-08c87ca4468c13b6f');
    const history = await getHistory({ EventId: '16145533-d8be-4314-b3b0-f9e2b8c8c8cb' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateVpnGateway_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateVpnGateway_H);
  });

  test('EC2_DeleteVpnGateway', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteVpnGateway);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpn-gateway/vgw-08c87ca4468c13b6f');
    const history = await getHistory({ EventId: '2318fbd9-4740-40e4-87e2-47264d2173b4' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteVpnGateway_H);
  });

  test('EC2_CreateTransitGateway', async () => {
    const event = await sendMessage(CreateEvents.EC2_CreateTransitGateway);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-3:999999999999:transit-gateway/tgw-02844bb728fca543c');
    const history = await getHistory({ EventId: '4856faf4-523f-46b9-b316-4c5ce426ebac' });

    // fs.writeFileSync('CreateTransitGateway_R.json', JSON.stringify(resource));
    // fs.writeFileSync('CreateTransitGateway_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateTransitGateway_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateTransitGateway_H);
  });

  test('EC2_DeleteTransitGateway', async () => {
    const event = await sendMessage(DeleteEvents.EC2_DeleteTransitGateway);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-3:999999999999:transit-gateway/tgw-02844bb728fca543c');
    const history = await getHistory({ EventId: 'e3c7821b-46d2-49f2-bfcf-04aea44c303f' });

    // fs.writeFileSync('DeleteTransitGateway_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeleteTransitGateway_H);
  });
});
