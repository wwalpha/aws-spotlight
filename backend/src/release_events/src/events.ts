import { DynamodbHelper } from '@alphax/dynamodb';
import { Tables } from 'typings';
import * as fs from 'fs';
import * as path from 'path';
import _ from 'lodash';

const EVENTS_FILE = '../../cloudtrail/test/configs/events.csv';
const IGNORE_FILE = '../../cloudtrail/test/configs/ignore.csv';

const helper = new DynamodbHelper();
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;
const TABLE_NAME_UNPROCESSED = process.env.TABLE_NAME_UNPROCESSED as string;

const start = async () => {
  const Events = [...getEvents(), ...getIgnore()];

  const allEvents = await helper.scan<Tables.TEventType>({
    TableName: TABLE_NAME_EVENT_TYPE,
  });

  let unpEvents = (
    await helper.scan<Tables.TEventType>({
      TableName: TABLE_NAME_UNPROCESSED,
      ProjectionExpression: 'EventName, EventSource',
    })
  ).Items;

  // 未処理のイベント一覧
  unpEvents = _.uniqWith(unpEvents, _.isEqual);

  const existEvents = allEvents.Items.filter((item) => item.Unconfirmed === true).map((item) => {
    const updatedEvents = Events.find((i) => i.EventName === item.EventName && i.EventSource === item.EventSource);

    // 未実装のイベントならそのまあ
    if (!updatedEvents) return item;

    return {
      ...updatedEvents,
      Unprocessed:
        unpEvents.find((upn) => upn.EventName === item.EventName && upn.EventSource === item.EventSource) !== undefined
          ? true
          : undefined,
    };
  });

  await helper.bulk(TABLE_NAME_EVENT_TYPE, existEvents);

  // 新規イベント
  const newEvents = Events.filter((item) => {
    const exist = allEvents.Items.find((e) => e.EventName === item.EventName && e.EventSource === item.EventSource);

    return exist === undefined;
  }).map((item) => ({
    ...item,
    Unprocessed:
      unpEvents.find((upn) => upn.EventName === item.EventName && upn.EventSource === item.EventSource) !== undefined
        ? true
        : undefined,
  }));

  await helper.bulk(TABLE_NAME_EVENT_TYPE, newEvents);
};

const getEvents = (): Tables.TEventType[] => {
  const texts = fs.readFileSync(path.join(__dirname, EVENTS_FILE)).toString();

  const lines = texts.split('\n').filter((item) => item !== '');

  return lines.map<Tables.TEventType>((item) => {
    const values = item.split(',');

    return {
      EventName: values[0],
      EventSource: values[1],
      Create: values[2] === 'create',
      Delete: values[2] === 'delete',
    };
  });
};

const getIgnore = (): Tables.TEventType[] => {
  const texts = fs.readFileSync(path.join(__dirname, IGNORE_FILE)).toString();

  const lines = texts.split('\n').filter((item) => item !== '');

  return lines.map<Tables.TEventType>((item) => {
    const values = item.split(',');

    return {
      EventName: values[0],
      EventSource: values[1],
      Ignore: true,
    };
  });
};

start();
