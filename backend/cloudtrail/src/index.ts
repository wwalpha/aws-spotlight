import _ from 'lodash';
import { APIGatewayProxyHandler, S3Event } from 'aws-lambda';
import { getRecords, initializeEvents, processNewRecords, processRenewRecords } from './apps/cloudtrail';
import { Logger } from './apps/utils';
import { personalResport, reports } from './apps/reports';
import { UnprocessedService } from './services';
import { CloudTrailRecord } from 'typings';
import { handler } from './cleanup';

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

export const userReport: APIGatewayProxyHandler = async (event) => {
  const datas = JSON.parse(event.body || '{}') as { userName: string };

  const url = await personalResport(datas.userName);

  // console.log('url', url);
  return {
    statusCode: 200,
    body: JSON.stringify({
      url,
    }),
    isBase64Encoded: false,
  };
};

export const monthlyCleanup = async () => {
  await handler();
};

// userReport(
//   {
//     body: JSON.stringify({
//       userName: 'ktou@dxc.com',
//     }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     httpMethod: 'POST',
//     isBase64Encoded: false,
//     multiValueHeaders: {
//       'Content-Type': ['application/json'],
//     },
//     path: '/userReport',
//     pathParameters: null,
//     queryStringParameters: null,
//     multiValueQueryStringParameters: null,
//     stageVariables: null,
//     requestContext: {} as any,
//     resource: '/userReport',
//   },
//   {} as any,
//   {} as any
// );
