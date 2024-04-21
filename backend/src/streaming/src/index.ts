import winston from 'winston';
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const EVENTS_TOPIC_ARN = process.env.EVENTS_TOPIC_ARN as string;

const Logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

const snsClient = new SNSClient();

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  Logger.info('event', event);
  Logger.info(`Start process records, ${event.Records.length}`);

  const ids = event.Records.filter((item) => item.eventName === 'INSERT')
    .map((item) => item.eventID)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  // send to SNS
  await snsClient.send(
    new PublishCommand({
      TopicArn: EVENTS_TOPIC_ARN,
      Message: ids.join(', '),
    })
  );
};
