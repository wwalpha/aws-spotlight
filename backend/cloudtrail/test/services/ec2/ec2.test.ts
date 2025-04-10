import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './excepts';

describe('EXPECTS.amazonaws.com', () => {
  test('EC2_RunInstances', async () => {
    const event = await sendMessage(Events.EC2_RunInstances);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:instance/i-0fc5d99558e8357e8');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_RunInstances);
  });

  test('EC2_TerminateInstances', async () => {
    const event = await sendMessage(Events.EC2_TerminateInstances);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:instance/i-0fc5d99558e8357e8');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_TerminateInstances);
  });

  test('EC2_CreateNatGateway', async () => {
    const event = await sendMessage(Events.EC2_CreateNatGateway);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:natgateway/nat-0cb758692bd70f8e6');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_CreateNatGateway);
  });

  test('EC2_DeleteNatGateway', async () => {
    const event = await sendMessage(Events.EC2_DeleteNatGateway);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:natgateway/nat-0cb758692bd70f8e6');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_DeleteNatGateway);
  });

  test('EC2_CreateClientVpnEndpoint', async () => {
    const event = await sendMessage(Events.EC2_CreateClientVpnEndpoint);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:client-vpn-endpoint/cvpn-endpoint-00979964d0389482a'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_CreateClientVpnEndpoint);
  });

  test('EC2_DeleteClientVpnEndpoint', async () => {
    const event = await sendMessage(Events.EC2_DeleteClientVpnEndpoint);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:client-vpn-endpoint/cvpn-endpoint-00979964d0389482a'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_DeleteClientVpnEndpoint);
  });

  test('EC2_CreateVpcPeeringConnection', async () => {
    const event = await sendMessage(Events.EC2_CreateVpcPeeringConnection);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:vpc-peering-connection/pcx-09cc395f56ffead9e'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_CreateVpcPeeringConnection);
  });

  test('EC2_DeleteVpcPeeringConnection', async () => {
    const event = await sendMessage(Events.EC2_DeleteVpcPeeringConnection);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:vpc-peering-connection/pcx-09cc395f56ffead9e'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_DeleteVpcPeeringConnection);
  });

  test('EC2_CreateVpc', async () => {
    const event = await sendMessage(Events.EC2_CreateVpc);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpc/vpc-0bda49e0068536141');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_CreateVpc);
  });

  test('EC2_DeleteVpc', async () => {
    const event = await sendMessage(Events.EC2_DeleteVpc);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpc/vpc-0bda49e0068536141');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_DeleteVpc);
  });

  test('EC2_CreateVpcEndpoint', async () => {
    const event = await sendMessage(Events.EC2_CreateVpcEndpoint);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpc-endpoint/vpce-0ef9277730bf26b70');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_CreateVpcEndpoint);
  });

  test('EC2_DeleteVpcEndpoints', async () => {
    const event = await sendMessage(Events.EC2_DeleteVpcEndpoints);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpc-endpoint/vpce-0ef9277730bf26b70');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_DeleteVpcEndpoints);
  });

  test('EC2_AllocateAddress', async () => {
    const event = await sendMessage(Events.EC2_AllocateAddress);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:elastic-ip/eipalloc-044e12137f28d65f6');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_AllocateAddress);
  });

  test('EC2_ReleaseAddress', async () => {
    const event = await sendMessage(Events.EC2_ReleaseAddress);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:elastic-ip/eipalloc-044e12137f28d65f6');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_ReleaseAddress);
  });

  test('EC2_CreateCustomerGateway', async () => {
    const event = await sendMessage(Events.EC2_CreateCustomerGateway);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:customer-gateway/cgw-0bf90d6d3825b7bbd'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_CreateCustomerGateway);
  });

  test('EC2_DeleteCustomerGateway', async () => {
    const event = await sendMessage(Events.EC2_DeleteCustomerGateway);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:customer-gateway/cgw-0bf90d6d3825b7bbd'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_DeleteCustomerGateway);
  });

  test('EC2_CreateVpnConnection', async () => {
    const event = await sendMessage(Events.EC2_CreateVpnConnection);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpn-connection/vpn-06d78c43438fa98fe');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_CreateVpnConnection);
  });

  test('EC2_DeleteVpnConnection', async () => {
    const event = await sendMessage(Events.EC2_DeleteVpnConnection);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpn-connection/vpn-06d78c43438fa98fe');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_DeleteVpnConnection);
  });

  test('EC2_CreateVpnGateway', async () => {
    const event = await sendMessage(Events.EC2_CreateVpnGateway);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpn-gateway/vgw-08c87ca4468c13b6f');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_CreateVpnGateway);
  });

  test('EC2_DeleteVpnGateway', async () => {
    const event = await sendMessage(Events.EC2_DeleteVpnGateway);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:vpn-gateway/vgw-08c87ca4468c13b6f');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_DeleteVpnGateway);
  });

  test('EC2_CreateTransitGateway', async () => {
    const event = await sendMessage(Events.EC2_CreateTransitGateway);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-3:999999999999:transit-gateway/tgw-02844bb728fca543c');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_CreateTransitGateway);
  });

  test('EC2_DeleteTransitGateway', async () => {
    const event = await sendMessage(Events.EC2_DeleteTransitGateway);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-3:999999999999:transit-gateway/tgw-02844bb728fca543c');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_DeleteTransitGateway);
  });

  test('EC2_CreateInternetGateway', async () => {
    const event = await sendMessage(Events.EC2_CreateInternetGateway);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:internet-gateway/igw-0cc6844795cc3e71e'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_CreateInternetGateway);
  });

  test('EC2_DeleteInternetGateway', async () => {
    const event = await sendMessage(Events.EC2_DeleteInternetGateway);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:ec2:ap-northeast-1:999999999999:internet-gateway/igw-0cc6844795cc3e71e'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EC2_DeleteInternetGateway);
  });
});
