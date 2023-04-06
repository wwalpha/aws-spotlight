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

  const existIgnores = allEvents.Items.filter((item) => item.Unconfirmed === true)
    .filter(
      (item) => Ignores.find((i) => i.EventName === item.EventName && i.EventSource === item.EventSource) !== undefined
    )
    .map((item) => ({ ...item, Unprocessed: true, Unconfirmed: undefined, Ignore: true }));

  await helper.bulk(TABLE_NAME_EVENT_TYPE, existIgnores);

  const existEvents = allEvents.Items.filter((item) => item.Unconfirmed === true)
    .filter(
      (item) => Events.find((i) => i.EventName === item.EventName && i.EventSource === item.EventSource) !== undefined
    )
    .map((item) => ({
      ...item,
      Unprocessed: true,
      Unconfirmed: undefined,
      Ignore: undefined,
      Create: Events.find((i) => i.EventName === item.EventName && i.EventSource === item.EventSource)?.Create,
      Delete: Events.find((i) => i.EventName === item.EventName && i.EventSource === item.EventSource)?.Delete,
    }));

  await helper.bulk(TABLE_NAME_EVENT_TYPE, existEvents);

  const newEvents = Events.filter((item) => {
    const exist = allEvents.Items.find((e) => e.EventName === item.EventName && e.EventSource === item.EventSource);

    return exist === undefined;
  }).map((item) => ({ ...item, Unprocessed: true }));

  await helper.bulk(TABLE_NAME_EVENT_TYPE, newEvents);

  const newIgnores = Ignores.filter((item) => {
    const exist = allEvents.Items.find((e) => e.EventName === item.EventName && e.EventSource === item.EventSource);

    return exist === undefined;
  }).map((item) => ({ ...item, Unprocessed: true }));

  await helper.bulk(TABLE_NAME_EVENT_TYPE, newIgnores);

  existIgnores.forEach((item) => console.log(item.EventName, item.EventSource));
  existEvents.forEach((item) => console.log(item.EventName, item.EventSource));
  newEvents.forEach((item) => console.log(item.EventName, item.EventSource));
  newIgnores.forEach((item) => console.log(item.EventName, item.EventSource));
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
