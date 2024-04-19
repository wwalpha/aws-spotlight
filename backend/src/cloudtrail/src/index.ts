import { SQSEvent } from 'aws-lambda';
import { execute, executeFiltering, initializeEvents } from './apps/cloudtrail';
import { processIgnore, processUpdate } from './apps/unprocessed';
import { Logger } from './apps/utils/utilities';
import { EventTypeService, UnprocessedService } from './services';
import { CloudTrail } from 'typings';
import { DynamodbHelper, Utilities } from './apps/utils';
import { Environments } from './apps/utils/consts';

// common settings
// AWS.config.update({
//   region: process.env.AWS_REGION,
//   ec2: { endpoint: process.env.AWS_ENDPOINT },
//   rds: { endpoint: process.env.AWS_ENDPOINT },
//   s3: { endpoint: process.env.AWS_ENDPOINT },
//   sqs: { endpoint: process.env.AWS_ENDPOINT },
//   sns: { endpoint: process.env.AWS_ENDPOINT },
//   dynamodb: { endpoint: process.env.AWS_ENDPOINT },
// });

/**
 * App Entry
 *
 * @returns
 */
export const cloudtrail = async (event: SQSEvent) => {
  Logger.info('event', event);

  // get event type definition
  await initializeEvents();

  Logger.info(`Start process records, ${event.Records.length}`);

  for (;;) {
    const message = event.Records.shift();

    // not found
    if (!message) break;

    await execute(message);
  }
};

/**
 * App Entry
 *
 * @returns
 */
export const filtering = async (event: SQSEvent) => {
  Logger.info('event', event);

  // get event type definition
  await initializeEvents();

  Logger.info(`Start process records, ${event.Records.length}`);

  let records: CloudTrail.Record[] = [];

  for (;;) {
    const message = event.Records.shift();

    // not found
    if (!message) break;

    const results = await executeFiltering(message);

    records = [...records, ...results];
  }

  Logger.info(`New records, ${records.length}`);

  if (records.length === 0) return;

  // add records
  await DynamodbHelper.bulk(
    Environments.TABLE_NAME_EVENTS,
    records.map((item) => Utilities.getEventsItem(item))
  );
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
