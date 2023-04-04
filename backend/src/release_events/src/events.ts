import { DynamodbHelper } from '@alphax/dynamodb';
import { Tables } from 'typings';
import * as fs from 'fs';
import * as path from 'path';

const EVENTS_FILE = '../../cloudtrail/test/configs/events.csv';
const IGNORE_FILE = '../../cloudtrail/test/configs/ignore.csv';

const helper = new DynamodbHelper();
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

const start = async () => {
  const Events = getEvents();
  const Ignores = getIgnore();

  const allEvents = await helper.scan<Tables.EventType>({
    TableName: TABLE_NAME_EVENT_TYPE,
  });

  const updateItems = allEvents.Items.map<Tables.EventType>((item) => {
    if (item.Unconfirmed === false) {
      return item;
    }

    const event = Events.find((e) => e.EventName === item.EventName && e.EventSource === item.EventSource);

    if (event) {
      return {
        ...event,
        Unprocessed: true,
      };
    }

    const ignore = Ignores.find((e) => e.EventName === item.EventName && e.EventSource === item.EventSource);

    if (ignore) {
      return {
        ...ignore,
        Unprocessed: true,
      };
    }

    return item;
  });

  await helper.bulk(TABLE_NAME_EVENT_TYPE, updateItems);

  const newEvents = Events.filter((item) => {
    const exist = allEvents.Items.find((e) => e.EventName === item.EventName && e.EventSource === item.EventSource);

    return exist === undefined;
  });

  await helper.bulk(TABLE_NAME_EVENT_TYPE, newEvents);
};

const getEvents = (): Tables.EventType[] => {
  const texts = fs.readFileSync(path.join(__dirname, EVENTS_FILE)).toString();

  const lines = texts.split('\n').filter((item) => item !== '');

  return lines.map<Tables.EventType>((item) => {
    const values = item.split(',');

    return {
      EventName: values[0],
      EventSource: values[1],
      Create: values[2] === 'create',
      Delete: values[2] === 'delete',
    };
  });
};

const getIgnore = (): Tables.EventType[] => {
  const texts = fs.readFileSync(path.join(__dirname, IGNORE_FILE)).toString();

  const lines = texts.split('\n').filter((item) => item !== '');

  return lines.map<Tables.EventType>((item) => {
    const values = item.split(',');

    return {
      EventName: values[0],
      EventSource: values[1],
      Ignore: true,
    };
  });
};

start();
