import { SQSEvent, SQSRecord } from "aws-lambda";
import winston from "winston";

const Logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

const handler = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
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
  await DynamodbHelper.bulk(Environments.TABLE_NAME_RAW, dataRows);

  const { queryStringParameters } = event;
  const { filter } = queryStringParameters || {};
  const result = await getFilteredData(filter);
  return {
    statusCode: 200,
  };
}


/**
 * Process SQS Message
 *
 * @param message
 */
const executeFiltering = async (message: SQSRecord) => {
  let records = await getRecords(message.body);
  Logger.info(`Process All Records: ${records.length}`);

  // remove readonly records
  records = Utilities.removeReadOnly(records);
  Logger.info(`Excluding ReadOnly Records: ${records.length}`);

  // remove error records
  records = Utilities.removeError(records);
  Logger.info(`Excluding Error Records: ${records.length}`);

  // remove ignore records
  // records = Utilities.removeIgnore(records, EVENTS);
  // Logger.info(`Excluding Ignore Records: ${records.length}`);

  await Utilities.deleteSQSMessage(message);

  return records;
};


/**
 * get all s3 bucket object
 *
 * @param message
 * @returns
 */
export const getRecords = async (message: string): Promise<CloudTrail.Record[]> => {
  const snsMessage = JSON.parse(message) as SNSMessage;

  // skip validation message
  if (snsMessage.Message.startsWith('CloudTrail validation message')) {
    return [];
  }

  const payload = JSON.parse(snsMessage.Message) as CloudTrail.Payload;

  // get files
  const tasks = payload.s3ObjectKey.map((item) =>
    s3Client.send(
      new GetObjectCommand({
        Bucket: payload.s3Bucket,
        Key: item,
      })
    )
  );

  // get all files
  const files = await Promise.all(tasks);

  // unzip content
  const records = (
    await Promise.all(
      files.map(async (item) => {
        const content = await item.Body?.transformToByteArray();

        if (!content) return undefined;

        // @ts-ignore
        return JSON.parse(zlib.gunzipSync(content)) as CloudTrail.Event;
      })
    )
  ).filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  Logger.debug('Records', records);

  // merge all records
  const newArray = records.reduce((prev, curr) => {
    return [...prev, ...curr.Records];
  }, [] as CloudTrail.Record[]);

  // 時間順
  return orderBy(newArray, ['eventTime'], ['asc']);
};

