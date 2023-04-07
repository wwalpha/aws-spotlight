import { SQSEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import { execute } from './apps/cloudtrail';
import { processIgnore, processUpdate } from './apps/unprocessed';
import { Logger } from './apps/utils/utilities';
import { initializeEvents } from './apps/commons';
import { EventTypeService, UnprocessedService } from './services';

// common settings
AWS.config.update({
  region: process.env.AWS_REGION,
  ec2: { endpoint: process.env.AWS_ENDPOINT },
  rds: { endpoint: process.env.AWS_ENDPOINT },
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  sns: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

/**
 * App Entry
 *
 * @returns
 */
export const cloudtrail = async (event: SQSEvent) => {
  Logger.info('event', event);

  // get event type definition
  await initializeEvents();

  // process message item
  const tasks = event.Records.map((item) => execute(item));

  await Promise.all(tasks);
};

/**
 *
 */
export const unprocessed = async () => {
  // get event type definition
  const allEvents = await EventTypeService.getAll();
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
