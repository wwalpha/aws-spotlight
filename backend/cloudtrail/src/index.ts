import _ from 'lodash';
import { S3Event } from 'aws-lambda';
import { getRecords, initializeEvents, processRecords } from './apps/cloudtrail';
import { Logger } from './apps/utils';

export const cloudtrail = async (events: S3Event) => {
  Logger.info('events', events);

  const bucket = _.get(events, 'Records[0].s3.bucket.name');
  const key = _.get(events, 'Records[0].s3.object.key');

  try {
    // Get records from S3
    const records = await getRecords(bucket, decodeURIComponent(key));

    // Initialize Event Type
    await initializeEvents();

    // Process records
    await processRecords(records);
  } catch (e) {
    Logger.error(e);
  }
};
