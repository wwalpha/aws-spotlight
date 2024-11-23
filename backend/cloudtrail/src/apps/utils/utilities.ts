import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import winston from 'winston';
import { Consts } from '.';

const snsClient = new SNSClient();

export const LoggerOptions: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
};

export const Logger = winston.createLogger(LoggerOptions);

export const sendMail = async (subject: string, message: string) => {
  await snsClient.send(
    new PublishCommand({
      TopicArn: Consts.Environments.SNS_TOPIC_ARN,
      Subject: subject,
      Message: message,
    })
  );
};
