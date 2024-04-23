import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { Tables } from 'typings';
import { Logger, execute } from './utilities';

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  Logger.info('event', event);
  Logger.info(`Start process records, ${event.Records.length}`);

  const keys = event.Records.filter((item) => item.eventName === 'INSERT' || item.eventName === 'MODIFY')
    .map<Tables.TResourceKey>((item) => ({
      ResourceId: item.dynamodb?.Keys?.ResourceId?.S || '',
      EventTime: item.dynamodb?.Keys?.EventTime?.S || '',
    }))
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  Logger.info('Keys', keys);

  await Promise.all(keys.map((key) => execute(key)));
};
