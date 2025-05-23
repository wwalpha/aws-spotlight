import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './excepts';

describe('apigateway.amazonaws.com', () => {
  test('CreateRestApi', async () => {
    const event = await sendMessage(Events.APIGATEWAY_CreateRestApi);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/jrrfh5tt86');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APIGATEWAY_CreateRestApi);
  });

  test('DeleteRestApi', async () => {
    const event = await sendMessage(Events.APIGATEWAY_DeleteRestApi);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/jrrfh5tt86');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APIGATEWAY_DeleteRestApi);
  });

  test('ImportRestApi', async () => {
    const event = await sendMessage(Events.APIGATEWAY_ImportRestApi);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/lyppg996u0');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APIGATEWAY_ImportRestApi);
  });

  test('APIGATEWAY_CreateApi', async () => {
    const event = await sendMessage(Events.APIGATEWAY_CreateApi);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/gk09okoppi');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APIGATEWAY_CreateApi);
  });

  test('APIGATEWAY_DeleteApi', async () => {
    const event = await sendMessage(Events.APIGATEWAY_DeleteApi);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/gk09okoppi');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APIGATEWAY_DeleteApi);
  });

  test('APIGATEWAY_CreateVpcLink', async () => {
    const event = await sendMessage(Events.APIGATEWAY_CreateVpcLink);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/vpclinks/j0owmk');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APIGATEWAY_CreateVpcLink);
  });

  test('APIGATEWAY_DeleteVpcLink', async () => {
    const event = await sendMessage(Events.APIGATEWAY_DeleteVpcLink);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/vpclinks/j0owmk');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APIGATEWAY_DeleteVpcLink);
  });

  test('APIGATEWAY_CreateDomainName', async () => {
    const event = await sendMessage(Events.APIGATEWAY_CreateDomainName);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/domainnames/api.arms.onecloudlabo.com');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APIGATEWAY_CreateDomainName);
  });

  test('APIGATEWAY_DeleteDomainName', async () => {
    const event = await sendMessage(Events.APIGATEWAY_DeleteDomainName);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/domainnames/api.arms.onecloudlabo.com');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APIGATEWAY_DeleteDomainName);
  });
});
