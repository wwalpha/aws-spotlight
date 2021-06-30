import { SQSEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import { execute, initializeEvents } from './apps/cloudtrail';
import { getUnprocessedEvents, processIgnore, processUpdate } from './apps/unprocessed';
import { Logger } from './apps/utils/utilities';

// common settings
AWS.config.update({
  region: process.env.AWS_REGION,
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
  const events = await getUnprocessedEvents();

  // ignore records
  await processIgnore(events);
  // update records
  await processUpdate(events);
};

process.on('unhandledRejection', (err) => {
  // @ts-ignore
  Logger.error(err?.message, err);
});
