// require('dotenv').config({ path: '.env.prod' });

import { cloudtrail, unprocessed } from '../src/index';
import { DynamodbHelper } from '@alphax/dynamodb';
import { receiveMessageData, sendMessage, sendMessageOnly, updateEventType } from './configs/utils';
import { ResourceService } from '@src/services';
import * as fs from 'fs';
import { Tables } from 'typings';

const TABLE_NAME_UNPROCESSED = process.env.TABLE_NAME_UNPROCESSED as string;
const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;
const TABLE_NAME_HISTORY = process.env.TABLE_NAME_HISTORY as string;
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
      Ignore: true,
      Unconfirmed: true,
    },
    {
      EventSource: 'ec2.amazonaws.com',
      EventName: 'TerminateInstances',
      Ignore: true,
      Unconfirmed: true,
    },
    {
      EventSource: 'ec2.amazonaws.com',
      EventName: 'AllocateAddress',
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

const output = async () => {
  const date = '2023-02-01';
  const results = await Promise.all([
    ResourceService.getListByEventSource('ec2.amazonaws.com', date),
    ResourceService.getListByEventSource('rds.amazonaws.com', date),
    ResourceService.getListByEventSource('fsx.amazonaws.com', date),
    ResourceService.getListByEventSource('ds.amazonaws.com', date),
  ]);

  const newArray = results.reduce((prev, curr) => {
    return [...prev, ...curr];
  }, [] as Tables.TResource[]);

  const dataRows = newArray.map((item) => `${item.UserName},${item.Service},${item.ResourceName},${item.ResourceId}`);

  fs.writeFileSync('resources.csv', dataRows.join('\n'));
};

// debug();
// startU();
output();
