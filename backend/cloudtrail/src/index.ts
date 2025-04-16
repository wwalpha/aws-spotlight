import _ from 'lodash';
import { S3Event } from 'aws-lambda';
import { getRecords, initializeEvents, processNewRecords, processRenewRecords } from './apps/cloudtrail';
import { Logger } from './apps/utils';
import { reports } from './apps/reports';
import { UnprocessedService } from './services';
import { CloudTrailRecord } from 'typings';

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
    await processNewRecords(records);

    // Process unprocessed records
    await unprocess();

    if (process.env.ENVIRONMENT !== 'dev') {
      await reports();
    }
  } catch (e) {
    Logger.error(e);
  }
};

export const unprocess = async () => {
  // Initialize Event Type
  await initializeEvents();

  const dataRows = await UnprocessedService.getAll();

  if (dataRows.length === 0) {
    Logger.info('No unprocessed data found');
    return;
  }

  const records = dataRows.map<CloudTrailRecord>((dataRow) => ({
    eventTime: dataRow.eventTime,
    userName: dataRow.userName,
    eventSource: dataRow.eventSource,
    eventName: dataRow.eventName,
    awsRegion: dataRow.awsRegion,
    sourceIPAddress: dataRow.sourceIPAddress,
    userAgent: dataRow.userAgent,
    requestParameters: dataRow.requestParameters,
    responseElements: dataRow.responseElements,
    additionalEventData: dataRow.additionalEventData,
    requestId: dataRow.requestID,
    eventId: dataRow.eventID,
    recipientAccountId: dataRow.recipientAccountId,
    serviceEventDetails: dataRow.serviceEventDetails,
    sharedEventId: dataRow.sharedEventId,
  }));

  await processRenewRecords(records);
};
