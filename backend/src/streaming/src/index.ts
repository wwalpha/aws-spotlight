import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { Tables } from 'typings';
import { Logger, execute } from './utilities';

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  Logger.info('event', event);
  Logger.info(`Start process records, ${event.Records.length}`);

  const keys = event.Records.filter((item) => item.eventName === 'INSERT')
    .map((item) => item.dynamodb?.Keys)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined)
    .map((item) => item as unknown as Tables.TResourceKey);

  console.log(keys);

  await Promise.all(keys.map((key) => execute(key)));
};
