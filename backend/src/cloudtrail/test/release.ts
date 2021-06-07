import { DynamodbHelper } from '@alphax/dynamodb';
import { Tables } from 'typings';
import Events from './configs/events.json';

const helper = new DynamodbHelper();
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;

const start = async () => {
  const unconfirmed = await helper.scan<Tables.EventType>({
    TableName: TABLE_NAME_EVENT_TYPE,
    FilterExpression: 'attribute_exists(Unconfirmed)',
  });

  for (let i = 0; i < unconfirmed.Items.length; i++) {
    const item = unconfirmed.Items[i];

    const setting = Events.find((e) => e.EventName === item.EventName && e.EventSource === item.EventSource);

    if (!setting) continue;

    await helper.truncate(TABLE_NAME_EVENT_TYPE, [
      {
        EventName: item.EventName,
        EventSource: item.EventSource,
      } as Tables.EventTypeKey,
    ]);

    await helper.put({
      TableName: TABLE_NAME_EVENT_TYPE,
      Item: {
        ...setting,
        Unprocessed: true,
      } as Tables.EventType,
    });
  }

  for (; Events.length > 0; ) {
    const item = Events.pop();

    if (!item) continue;

    try {
      await helper.put({
        TableName: TABLE_NAME_EVENT_TYPE,
        Item: {
          ...item,
          Unprocessed: true,
        } as Tables.EventType,
        ConditionExpression: 'attribute_not_exists(EventName) AND attribute_not_exists(EventSource)',
      });
    } catch (err) {
      if (err.code !== 'ConditionalCheckFailedException') {
        console.log(err);
      }
    }
  }
};

start();
