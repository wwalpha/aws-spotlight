import { SQSEvent } from 'aws-lambda';
import _ from 'lodash';
import { execute, executeFiltering, initializeEvents } from './apps/cloudtrail';
import { processIgnore, processUpdate } from './apps/unprocessed';
import { Logger } from './apps/utils/utilities';
import { EventTypeService, UnprocessedService } from './services';
import { CloudTrail, Tables } from 'typings';
import { DynamodbHelper, Utilities } from './apps/utils';
import { Environments } from './apps/utils/consts';

/**
 * App Entry
 *
 * @returns
 */
export const cloudtrail = async (events: Tables.TEvents[]) => {
  // Logger.info('events', events);

  // get event type definition
  await initializeEvents();

  // execute
  await execute(events);
};

/**
 * App Entry
 *
 * @returns
 */
export const filtering = async (event: SQSEvent) => {
  Logger.info('event', event);

  Logger.info(`Start process records, ${event.Records.length}`);

  const results = await Promise.all(
    event.Records.map(async (item) => {
      return await executeFiltering(item);
    })
  );

  const records = results.reduce((prev, curr) => {
    return [...prev, ...curr];
  }, [] as CloudTrail.Record[]);

  // no records
  if (records.length === 0) return;

  // get unique records
  const dataRows = _.uniqBy(
    records.map((item) => Utilities.getEventsItem(item)),
    'EventId'
  );

  // bulk insert
  await DynamodbHelper.bulk(Environments.TABLE_NAME_RAW, dataRows);
};

/**
 *
 */
export const unprocessed = async () => {
  // get event type definition
  const allEvents = (await EventTypeService.getAll()).filter((item) => item.Unconfirmed === undefined);
  // get unprocessed events
  const unpEvents = await UnprocessedService.getEvents();

  const events = unpEvents
    .filter(
      (u) => allEvents.find((all) => all.EventName === u.EventName && all.EventSource === u.EventSource) !== undefined
    )
    .map((u) => allEvents.find((all) => all.EventName === u.EventName && all.EventSource === u.EventSource))
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  // ignore records
  await processIgnore(events);
  // update records
  await processUpdate(events);
};

process.on('unhandledRejection', (err) => {
  // @ts-ignore
  Logger.error(err?.message, err);
});
