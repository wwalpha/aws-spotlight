import { Handler, SNSMessage, SQSEvent, SQSRecord } from 'aws-lambda';
import _ from 'lodash';
import { DynamodbHelper, Logger } from './utilities';
import * as Utilities from './utilities';
import { CloudTrail, Tables } from 'typings';

const TABLE_NAME_RAW = process.env.TABLE_NAME_RAW as string;
const TABLE_NAME_EVENTS = process.env.TABLE_NAME_EVENTS as string;

export const handler: Handler = async (event: SQSEvent) => {
  Logger.info('event', event);
  Logger.info(`Start process records, ${event.Records.length}`);

  // get event type definition
  await Utilities.initializeEvents();

  await Promise.all(
    event.Records.map(async (item) => {
      return await filtering(item);
    })
  );
};

const getDataRows = async (eventIds: string[]) => {
  const results = await Promise.all(
    eventIds.map(
      async (eventId) =>
        await DynamodbHelper.get<Tables.TRaw>({
          TableName: TABLE_NAME_RAW,
          Key: { EventId: eventId },
          ProjectionExpression: 'EventId, Origin',
        })
    )
  );

  return results
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined)
    .map((item) => item.Item)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);
};

/**
 * Process SQS Message
 *
 * @param message
 */
const filtering = async (message: SQSRecord) => {
  const eventIds = (JSON.parse(message.body) as SNSMessage).Message.split(',');
  // get data rows
  const dataRows = await getDataRows(eventIds);

  // process filtering
  const events = Utilities.removeIgnore(dataRows);

  Logger.info(`Excluding Ignore Records: ${events.length}`);

  if (events.length === 0) {
    return;
  }

  // get unique records
  const eventRows = _.uniqBy(
    events.map((item) => Utilities.getEventsItem(JSON.parse(item.Origin) as CloudTrail.Record)),
    'EventId'
  );

  try {
    // bulk insert
    await DynamodbHelper.bulk(TABLE_NAME_EVENTS, eventRows);

    Logger.info(`Bulk Insert: ${eventRows.length}`);

    // send to sns
    await Utilities.sendToSNS(eventRows);

    // delete message
    await Utilities.deleteSQSMessage(message);

    Logger.info(`Delete Message: ${message.messageId}`);
  } catch (e) {
    const err = e as unknown as Error;

    if (err.name === 'ThrottlingException') {
      Logger.error('ThrottlingException', err.message);
      return;
    }

    if (err.name === 'LimitExceededException') {
      Logger.error('LimitExceededException', err.message);
      return;
    }

    Logger.error(e);
  }
};
