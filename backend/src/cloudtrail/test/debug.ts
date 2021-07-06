// require('dotenv').config({ path: '.env.prod' });

import { cloudtrail, unprocessed } from '../src/index';
import { DynamodbHelper } from '@alphax/dynamodb';
import { receiveMessageData, sendMessage, sendMessageOnly, updateEventType } from './configs/utils';
import EC2_CreateImage from './datas/create/EC2_CreateImage.json';
import EC2_RunInstances from './datas/create/EC2_RunInstances.json';
import EC2_TerminateInstances from './datas/delete/EC2_TerminateInstances.json';
import RDS_CreateDBCluster from './datas/create/RDS_CreateDBCluster.json';
import ELASTICLOADBALANCING_CreateLoadBalancer from './datas/create/ELASTICLOADBALANCING_CreateLoadBalancer.json';

const TABLE_NAME_UNPROCESSED = process.env.TABLE_NAME_UNPROCESSED as string;
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

const helper = new DynamodbHelper();

const startU = async () => {
  // await helper.put({
  //   TableName: process.env.TABLE_NAME_UNPROCESSED as string,
  //   Item: {
  //     EventName: 'RunInstances',
  //     EventTime: '2021-04-07T15:53:12Z_ce2437c8',
  //     Raw: JSON.stringify(require('./RunInstances.json')),
  //   } as Tables.Unprocessed,
  // });

  await unprocessed();
};

const startC = async () => {
  const events = [EC2_CreateImage, EC2_RunInstances, RDS_CreateDBCluster, ELASTICLOADBALANCING_CreateLoadBalancer];

  const tasks = events.map(async (item) => {
    const event = await sendMessage(item);
    await cloudtrail(event);
  });

  await Promise.all(tasks);
};

const updateEvent = async () => {
  // start();

  await helper.bulk(process.env.TABLE_NAME_EVENT_TYPE as string, require('./configs/events_all.json'));
};

// startC();
// updateEvent();

const test = async () => {
  await helper.bulk(TABLE_NAME_EVENT_TYPE, [
    {
      EventSource: 'ec2.amazonaws.com',
      EventName: 'RunInstances',
      Unprocessed: true,
      Ignore: true,
      Unconfirmed: true,
    },
    {
      EventSource: 'ec2.amazonaws.com',
      EventName: 'TerminateInstances',
      Unprocessed: true,
      Ignore: true,
      Unconfirmed: true,
    },
    {
      EventSource: 'ec2.amazonaws.com',
      EventName: 'AllocateAddress',
      Unprocessed: true,
      Ignore: true,
      Unconfirmed: true,
    },
  ]);

  await updateEventType('ec2.amazonaws.com', 'AllocateAddress', 'Ignore');

  await unprocessed();
};

const debug = async () => {
  const datas = await receiveMessageData();

  await cloudtrail(datas);
};

debug();
