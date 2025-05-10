import _ from 'lodash';
import { S3Event } from 'aws-lambda';
import { getRecords, initializeEvents, processNewRecords, processRenewRecords } from './apps/cloudtrail';
import { Consts, Logger } from './apps/utils';
import { reports } from './apps/reports';
import { UnprocessedService } from './services';
import { CloudTrailRecord } from 'typings';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

export const userReport = async (event: { userName: string }): Promise<string> => {
  const resources = await reports();
  const dataRows: string[] = [];
  // title
  dataRows.push('"UserName","Region","Service","ResourceName","EventName","EventTime","ResourceId"');

  resources.forEach((item) => {
    if (item.startsWith(`"${event.userName}"`)) {
      // rows
      dataRows.push(item);
    }
  });

  const contents = dataRows.join('\n');
  const objectKey = `Reports/${new Date().toISOString()}_${event.userName}.csv`;

  const s3Client = new S3Client({ region: process.env.AWS_REGION });

  // upload
  await s3Client.send(
    new PutObjectCommand({
      Bucket: Consts.Environments.S3_BUCKET_MATERIALS,
      Key: objectKey,
      Body: contents,
    })
  );

  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: Consts.Environments.S3_BUCKET_MATERIALS,
      Key: objectKey,
    }),
    { expiresIn: 3600 }
  );

  console.log(url);

  return url;
};
