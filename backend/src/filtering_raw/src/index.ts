import { Handler, SQSEvent, SQSRecord } from 'aws-lambda';
import _ from 'lodash';
import { DynamodbHelper, Logger } from './utilities';
import * as Utilities from './utilities';

const TABLE_NAME_RAW = process.env.TABLE_NAME_RAW as string;

export const handler: Handler = async (event: SQSEvent) => {
  Logger.info('event', event);
  Logger.info(`Start process records, ${event.Records.length}`);

  await Promise.all(
    event.Records.map(async (item) => {
      return await executeFiltering(item);
    })
  );
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

  if (records.length === 0) {
    return;
  }

  // get unique records
  const dataRows = _.uniqBy(
    records.map((item) => Utilities.getEventsItem(item)),
    'EventId'
  );

  try {
    // bulk insert
    await DynamodbHelper.bulk(TABLE_NAME_RAW, dataRows);

    Logger.info(`Bulk Insert: ${dataRows.length}`);

    // delete message
    await Utilities.deleteSQSMessage(message);

    Logger.info(`Delete Message: ${message.messageId}`);
  } catch (e) {
    const err = e as unknown as Error;

    if (err.name === 'ThrottlingException') {
      Logger.error('ThrottlingException', err.message);
      return;
    }

    if (err.name === 'LimitExceededException') {
      Logger.error('LimitExceededException', err.message);
      return;
    }

    Logger.error(e);
  }
};
