import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { Tables } from 'typings';
import { Logger, execute } from './utilities';
import { chain } from 'lodash';

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  Logger.info('event', event);
  Logger.info(`Start process records, ${event.Records.length}`);

  const keys = event.Records.filter((item) => item.eventName === 'INSERT')
    .map<Tables.TResourceKey | undefined>((item) => {
      const keys = item.dynamodb?.Keys;

      if (keys === undefined) {
        return undefined;
      }

      return {
        ResourceId: keys.ResourceId?.S || '',
        EventTime: keys.EventTime?.S || '',
      };
    })
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  console.log(keys);
  Logger.info('Keys', keys);

  // group by ResourceId
  // const groupedKeys = chain(keys)
  //   .groupBy((x) => x.ResourceId)
  //   .map((values, key) => ({ [key]: values }))
  //   .value();

  // Logger.info('groupedKeys', groupedKeys);

  await Promise.all(keys.map((key) => execute(key)));
};
