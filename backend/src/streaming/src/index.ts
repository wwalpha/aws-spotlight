import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { Tables } from 'typings';
import { Logger, execute } from './utilities';

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  Logger.info('event', event);
  Logger.info(`Start process records, ${event.Records.length}`);

  const keys = event.Records.filter((item) => item.eventName === 'INSERT' || item.eventName === 'MODIFY')
    .map<Tables.TResourceKey>((item) => ({
      ResourceId: item.dynamodb?.NewImage?.ResourceId?.S || '',
      EventTime: item.dynamodb?.NewImage?.EventTime?.S || '',
    }))
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  console.log(keys);

  await Promise.all(keys.map((key) => execute(key)));
};
