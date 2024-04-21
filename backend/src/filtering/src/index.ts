import { SQSEvent, SQSRecord } from 'aws-lambda';
import _ from 'lodash';
import { CloudTrail } from 'typings';
import { DynamodbHelper, Logger } from './utilities';
import * as Utilities from './utilities';

const TABLE_NAME_RAW = process.env.TABLE_NAME_RAW as string;

export const handler = async (event: SQSEvent): Promise<void> => {
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
  await DynamodbHelper.bulk(TABLE_NAME_RAW, dataRows);
};

/**
 * Process SQS Message
 *
 * @param message
 */
const executeFiltering = async (message: SQSRecord) => {
  let records = await Utilities.getRecords(message.body);
  Logger.info(`Process All Records: ${records.length}`);

  // remove readonly records
  records = Utilities.removeReadOnly(records);
  Logger.info(`Excluding ReadOnly Records: ${records.length}`);

  // remove error records
  records = Utilities.removeError(records);
  Logger.info(`Excluding Error Records: ${records.length}`);

  await Utilities.deleteSQSMessage(message);

  return records;
};
