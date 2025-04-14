import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('route53.amazonaws.com', () => {
  test('ROUTE53_CreateHostedZone', async () => {
    const event = await sendMessage(Events.ROUTE53_CreateHostedZone);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:route53:::hostedzone/AAAAAAAAAAAAAAAA');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ROUTE53_CreateHostedZone);
  });

  test('ROUTE53_DeleteHostedZone', async () => {
    const event = await sendMessage(Events.ROUTE53_DeleteHostedZone);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:route53:::hostedzone/AAAAAAAAAAAAAAAA');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ROUTE53_DeleteHostedZone);
  });

  test('ROUTE53PROFILES_CreateProfile', async () => {
    const event = await sendMessage(Events.ROUTE53_CreateProfile);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:route53profiles:ap-northeast-1:999999999999:profile/rp-2c619646259d48f0'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ROUTE53_CreateProfile);
  });

  test('ROUTE53PROFILES_DeleteProfile', async () => {
    const event = await sendMessage(Events.ROUTE53_DeleteProfile);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:route53profiles:ap-northeast-1:999999999999:profile/rp-2c619646259d48f0'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ROUTE53_DeleteProfile);
  });
});

describe('route53resolver.amazonaws.com', () => {
  test('ROUTE53RESOLVER_CreateResolverEndpoint', async () => {
    const event = await sendMessage(Events.ROUTE53RESOLVER_CreateResolverEndpoint);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:route53resolver:ap-northeast-1:999999999999:resolver-endpoint/rslvr-in-9747e1a641b34ad39'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ROUTE53RESOLVER_CreateResolverEndpoint);
  });

  test('ROUTE53RESOLVER_DeleteResolverEndpoint', async () => {
    const event = await sendMessage(Events.ROUTE53RESOLVER_DeleteResolverEndpoint);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:route53resolver:ap-northeast-1:999999999999:resolver-endpoint/rslvr-in-9747e1a641b34ad39'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ROUTE53RESOLVER_DeleteResolverEndpoint);
  });

  test('ROUTE53RESOLVER_CreateResolverRule', async () => {
    const event = await sendMessage(Events.ROUTE53RESOLVER_CreateResolverRule);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:route53resolver:ap-northeast-1:999999999999:resolver-rule/rslvr-rr-e9a0c626755e42dc9'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ROUTE53RESOLVER_CreateResolverRule);
  });

  test('ROUTE53RESOLVER_DeleteResolverRule', async () => {
    const event = await sendMessage(Events.ROUTE53RESOLVER_DeleteResolverRule);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:route53resolver:ap-northeast-1:999999999999:resolver-rule/rslvr-rr-e9a0c626755e42dc9'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ROUTE53RESOLVER_DeleteResolverRule);
  });
});
