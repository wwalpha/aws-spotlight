import { DynamodbHelper } from '@alphax/dynamodb';
import { Tables } from 'typings';
import Events from '../../cloudtrail/test/configs/events.json';
import Ignores from '../../cloudtrail/test/configs/ignore.json';

const helper = new DynamodbHelper();
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

const start = async () => {
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

start();
