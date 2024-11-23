import _ from 'lodash';
import { Handler, S3Event } from 'aws-lambda';
import { getRecords, initializeEvents, processRecords } from './apps/cloudtrail';
import { Logger } from './apps/utils';

export const cloudtrail: Handler = async (events: S3Event) => {
  Logger.info('events', events);

  const bucket = _.get(events, 'Records[0].s3.bucket.name');
  const key = _.get(events, 'Records[0].s3.object.key');

  try {
    // Get records from S3
    const records = await getRecords(bucket, key);

    // Initialize Event Type
    await initializeEvents();

    // Process records
    await processRecords(records);
  } catch (e) {
    Logger.error(e);
  }
};

cloudtrail(
  {
    Records: [
      {
        eventVersion: '2.0',
        eventSource: 'aws:s3',
        awsRegion: 'us-east-1',
        eventTime: '1970-01-01T00:00:00.000Z',
        eventName: 'ObjectCreated:Put',
        s3: {
          bucket: {
            name: 'spotlight-material-us-east-1-dev',
          },
          object: {
            key: 'CloudTrail/year=2021/month=07/20210701.csv',
          },
        },
      },
    ],
  },
  undefined as any,
  undefined as any
);
