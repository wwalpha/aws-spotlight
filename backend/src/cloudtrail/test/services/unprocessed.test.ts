import AWS from 'aws-sdk';
import { DynamodbHelper } from '@alphax/dynamodb';
import { getHistory, getResource, getUnprocessed, updateEventType } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as Unprocessed from '@test/expect/unprocessed';
import { unprocessed } from '@src/index';
import { Tables } from 'typings';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;
const TABLE_NAME_UNPROCESSED = process.env.TABLE_NAME_UNPROCESSED as string;
const EVENT_SOURCE = 'ec2.amazonaws.com';

describe.skip(EVENT_SOURCE, () => {
  beforeAll(async () => {
    await helper.bulk(TABLE_NAME_EVENT_TYPE, [
      {
        EventSource: EVENT_SOURCE,
        EventName: 'RunInstances',
        Unprocessed: true,
        Ignore: true,
        Unconfirmed: true,
      },
      {
        EventSource: EVENT_SOURCE,
        EventName: 'TerminateInstances',
        Unprocessed: true,
        Ignore: true,
        Unconfirmed: true,
      },
      {
        EventSource: EVENT_SOURCE,
        EventName: 'AllocateAddress',
        Unprocessed: true,
        Ignore: true,
        Unconfirmed: true,
      },
    ]);

    CreateEvents.EC2_RunInstances.responseElements.instancesSet.items[0].instanceId = 'i-0fc5d99558e835799';
    CreateEvents.EC2_RunInstances.eventID = '99999999-7469-441a-8f2e-f7aa5b61a46b';
    DeleteEvents.EC2_TerminateInstances.responseElements.instancesSet.items[0].instanceId = 'i-0fc5d99558e835799';
    DeleteEvents.EC2_TerminateInstances.eventID = '99999999-eb47-4d50-8104-6901bc67a17d';

    const datas = [CreateEvents.EC2_RunInstances, DeleteEvents.EC2_TerminateInstances];

    const unproccessed = datas.map(
      (item) =>
        ({
          EventName: item.eventName,
          EventTime: `${item.eventTime}_${item.eventID.substr(0, 8)}`,
          Raw: JSON.stringify(item),
        } as Tables.Unprocessed)
    );

    await helper.bulk(TABLE_NAME_UNPROCESSED, unproccessed);
  });

  test('EC2_RunInstances', async () => {
    await updateEventType(EVENT_SOURCE, 'RunInstances', 'Create');

    await unprocessed();

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:instance/i-0fc5d99558e835799');
    const history = await getHistory({ EventId: '99999999-7469-441a-8f2e-f7aa5b61a46b' });
    const unprocess = await getUnprocessed({
      EventName: 'RunInstances',
      EventTime: `${CreateEvents.EC2_RunInstances.eventTime}_${CreateEvents.EC2_RunInstances.eventID.substr(0, 8)}`,
    });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(Unprocessed.RunInstances_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(Unprocessed.RunInstances_H);

    expect(unprocess).toBeUndefined();
  });

  test('EC2_TerminateInstances', async () => {
    await updateEventType(EVENT_SOURCE, 'TerminateInstances', 'Delete');

    await unprocessed();

    // const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:instance/i-0fc5d99558e835799');
    // const history = await getHistory({ EventId: '99999999-eb47-4d50-8104-6901bc67a17d' });
    // const unprocess = await getUnprocessed({
    //   EventName: 'TerminateInstances',
    //   EventTime: `${DeleteEvents.EC2_TerminateInstances.eventTime}_99999999`,
    // });

    // expect(resource).toBeUndefined();

    // expect(history).not.toBeUndefined();
    // expect(history).toEqual(Unprocessed.TerminateInstances_H);

    // expect(unprocess).toBeUndefined();
  });
});
