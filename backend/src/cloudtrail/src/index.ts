import { SQSEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import { execute, initializeEvents } from './apps/cloudtrail';
import { getUnprocessedEvents, processCreate, processIgnore } from './apps/unprocessed';

// common settings
AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

/**
 * App Entry
 *
 * @returns
 */
export const cloudtrail = async (event: SQSEvent) => {
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

  // console.log(events);

  // ignore records
  await processIgnore(events);
  // create records
  await processCreate(events);
};
