// require('dotenv').config({ path: '.env.prod' });
// require('dotenv').config({ path: '.env.test' });

import { cloudtrail, unprocessed, cloudtrail2 } from '../src/index';
import { receiveMessageData, sendMessage, sendMessageOnly, updateEventType } from './configs/utils';
import { ResourceService } from '@src/services';
import * as CreateEvents from '@test/datas/create';
import * as fs from 'fs';
import { Tables } from 'typings';
import { Environments } from '@src/apps/utils/consts';
import { DynamodbHelper, Utilities } from '@src/apps/utils';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const TABLE_NAME_UNPROCESSED = process.env.TABLE_NAME_UNPROCESSED as string;
const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;
const TABLE_NAME_HISTORY = process.env.TABLE_NAME_HISTORY as string;
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;
const TABLE_NAME_EVENTS = process.env.TABLE_NAME_EVENTS as string;
const TABLE_NAME_RAW = process.env.TABLE_NAME_RAW as string;
const SNS_TOPIC_ARN_CLOUDTRAIL = process.env.SNS_TOPIC_ARN_CLOUDTRAIL as string;
const SNS_TOPIC_ARN_EVENTS = process.env.SNS_TOPIC_ARN_EVENTS as string;
const SQS_URL_CLOUDTRAIL = process.env.SQS_URL_CLOUDTRAIL as string;
const SQS_URL = process.env.SQS_URL as string;

const snsClient = new SNSClient();

const test = async () => {
  await DynamodbHelper.bulk(TABLE_NAME_EVENT_TYPE, [
    {
      EventSource: 'ec2.amazonaws.com',
      EventName: 'RunInstances',
      Ignore: true,
      Unconfirmed: true,
    },
    {
      EventSource: 'ec2.amazonaws.com',
      EventName: 'TerminateInstances',
      Ignore: true,
      Unconfirmed: true,
    },
    {
      EventSource: 'ec2.amazonaws.com',
      EventName: 'AllocateAddress',
      Ignore: true,
      Unconfirmed: true,
    },
  ]);

  await updateEventType('ec2.amazonaws.com', 'AllocateAddress', 'Ignore');

  await unprocessed();
};

// const debugFiltering = async () => {
//   // await sendMessageOnly([CreateEvents.DMS_CreateReplicationInstance]);

//   const event = await receiveMessageData();

//   try {
//     await filtering(event);
//   } catch (err) {
//     console.log(err);
//   }

//   // console.log(event);
//   // await cloudtrail(event);
// };

const debugCloudTrail = async () => {
  console.log('start debugCloudTrail');

  const eventId = '90f99df2-e854-4c45-be3f-2e0a9147287c';

  try {
    await cloudtrail2(
      {
        Records: [
          {
            attributes: {
              AWSTraceHeader:
                'Root=1-662a74d6-dd85f619770b0758c769c4ff;Parent=70173ec2076274e3;Sampled=0;Lineage=4853cf54:0|7f253a9a:0',
              ApproximateFirstReceiveTimestamp: '1714058545404',
              ApproximateReceiveCount: '4',
              SenderId: 'AIDAIT2UOQQY3AUEKVGXU',
              SentTimestamp: '1714058455404',
            },
            awsRegion: 'us-east-1',
            body: '{\n  "Type" : "Notification",\n  "MessageId" : "c2c7a9c5-d574-5307-8421-f761a263e465",\n  "TopicArn" : "arn:aws:sns:us-east-1:334678299258:arms-cloudtrail-44e2a0",\n  "Message" : "59ae2cc0-c259-445c-8bdd-2ef0c88297ae,e381668e-2390-4d93-8604-4a0dfb2929ce,b4fa6bf5-7a4f-42c7-bb16-bbe39e339f20,6a9e04c0-b435-4db5-a628-34b4bf9bd314,fa6e655b-614e-4b52-8de5-6caab6750a47,bbc4a660-d495-4a3a-b768-5e44dd507297,0534e127-ab9e-45b2-9ac6-17e743b8b4e9,5954dfdd-60a2-4de8-95f2-b7a262914fe4",\n  "Timestamp" : "2024-04-25T15:20:55.378Z",\n  "SignatureVersion" : "1",\n  "Signature" : "cDyWFgB1pUTqEgStQaPSXlr+hTDWtDugKmjwhrPB1IibJ7KOhYoYVrb7pOxtKiqzMTAPQ2AMKI+RTcS8cCaTQIahv8bs/FvoVXcKsv8uDJ9ABmYhuFj50f5uHYRq7Tktm5EYvSsid9l91lzAX9BZgJTyMR4G7NRh7D6fDHxfxA1KIFqJ2tcapeym1F5IKw1vYIyJjodDTVPs0SAAO4lapy5lFFLY6hwPGdfWsBEQd1mjAM98n9KfwlEmlpe5KNss3rA0bDk+WSXxIPPdMKUxPLmUyfmn1CcMUp8IY7UEEoJ9Xy3i0ZL/gJCj6S/f4z8PLHCMjb0h1/+U333Xu3WqsA==",\n  "SigningCertURL" : "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-60eadc530605d63b8e62a523676ef735.pem",\n  "UnsubscribeURL" : "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:334678299258:arms-cloudtrail-44e2a0:dbd4c5f3-8185-4c3e-8224-9321cbb75565"\n}',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:334678299258:arms-cloudtrail-44e2a0',
            md5OfBody: '8c307c9f7cc2db01ccfe9330e28db5f2',
            md5OfMessageAttributes: null,
            messageAttributes: {},
            messageId: '55251c5b-c3bc-4695-a8f7-2d3874c0ae2e',
            receiptHandle:
              'AQEBOd29oIOqkJ7/zYTCjRACpozgehLh5BJuVhg7g+Ms056qYMWn/B0D114ibJ1RzYpXdJfjbAteedAxJ5gik5iWm0dKwh/5hvRrsFT57/68INZnKKeyyJX9/w18LwE/eFma9rMs61BYGZa+HTVQG5ZAz/G01MXIkSqKUNQLDPF0yTRAL2xu/lNyVo+3rT2YaJvkA/3L+yzk0fsNWk+QvQD01EpK4EYbFYbcrOw8ByaG/9H0nxz2koBBZ0eWQUAX7of/nl3m23GTxiNo5FGFguGKRE3uGiJme1gq4ZzvhLA3fpBBqOo7FrEdnMSoWGpe6x4I60wBn8sZ95F4rdFskvgSDEbnbWPJGd2sw4082JebUxEbvNCTSzLgXzZfCjcPME4jLorjKp2OuG6Au+UTKVobJA==',
          },
        ],
      },
      null as any,
      () => {}
    );
  } catch (err) {
    console.log(err);
  }
};

const output = async () => {
  const date = '2023-02-01';
  const results = await Promise.all([
    ResourceService.getListByEventSource('ec2.amazonaws.com', date),
    ResourceService.getListByEventSource('rds.amazonaws.com', date),
    ResourceService.getListByEventSource('fsx.amazonaws.com', date),
    ResourceService.getListByEventSource('ds.amazonaws.com', date),
  ]);

  const newArray = results.reduce((prev, curr) => {
    return [...prev, ...curr];
  }, [] as Tables.TResource[]);

  const dataRows = newArray.map((item) => `${item.UserName},${item.Service},${item.ResourceName},${item.ResourceId}`);

  fs.writeFileSync('resources.csv', dataRows.join('\n'));
};

const truncate = async () => {
  await DynamodbHelper.truncateAll('');
};

// startU();
// output();
// bugfix();

const debug2 = async () => {
  const results = await DynamodbHelper.query<Tables.TEvents>({
    TableName: TABLE_NAME_EVENTS,
    // KeyConditionExpression: '#EventSource = :EventSource AND #EventName = :EventName',
    KeyConditionExpression: '#EventSource = :EventSource',
    ExpressionAttributeNames: {
      '#EventSource': 'EventSource',
      // '#EventName': 'EventName',
    },
    ExpressionAttributeValues: {
      ':EventSource': 'cloud9.amazonaws.com',
      // ':EventName': 'CreateApi',
    },
    IndexName: 'gsiIdx1',
  });
  // const results = await DynamodbHelper.scan<Tables.TEvents>({
  //   TableName: TABLE_NAME_EVENTS,
  //   ProjectionExpression: 'EventId',
  // });

  const eventIds = results.Items.map((item) => item.EventId);

  // console.log(eventIds);
  for (;;) {
    const ids = eventIds.splice(0, 100);

    // send to SNS
    await snsClient.send(
      new PublishCommand({
        TopicArn: SNS_TOPIC_ARN_CLOUDTRAIL,
        Message: ids.join(','),
      })
    );

    console.log('Length:', eventIds.length);

    if (eventIds.length === 0) break;
  }
};

const transferToEvents = async () => {
  const results = await DynamodbHelper.query<Tables.TRaw>({
    TableName: TABLE_NAME_RAW,
    KeyConditionExpression: '#EventSource = :EventSource',
    ExpressionAttributeNames: {
      '#EventSource': 'EventSource',
    },
    ExpressionAttributeValues: {
      ':EventSource': 'cloud9.amazonaws.com',
    },
    IndexName: 'gsiIdx1',
  });

  const eventIds = results.Items.map((item) => item.EventId);

  for (;;) {
    const ids = eventIds.splice(0, 10);

    // send to SNS
    await snsClient.send(
      new PublishCommand({
        TopicArn: SNS_TOPIC_ARN_EVENTS,
        Message: ids.join(','),
      })
    );

    console.log('Length:', eventIds.length);

    if (eventIds.length === 0) break;
  }
};

const newResources = async () => {
  const results = await DynamodbHelper.query<Tables.TRaw>({
    TableName: TABLE_NAME_RAW,
    // KeyConditionExpression: '#EventSource = :EventSource AND #EventName = :EventName',
    KeyConditionExpression: '#EventSource = :EventSource',
    ExpressionAttributeNames: {
      '#EventSource': 'EventSource',
      // '#EventName': 'EventName',
    },
    ExpressionAttributeValues: {
      ':EventSource': 'cloud9.amazonaws.com',
      // ':EventName': 'CreateApi',
    },
    IndexName: 'gsiIdx1',
  });

  const set = new Set(results.Items.map((item) => item.EventName));

  console.log(set.values());
};

const redrive = async () => {
  const datas = await receiveMessageData();

  const tasks = datas.Records.map(async (item) => {
    const messages = JSON.parse(item.body).Message.split(',');

    for (;;) {
      const message = messages.pop();

      if (message === undefined) break;

      // send to SNS
      await snsClient.send(
        new PublishCommand({
          TopicArn: SNS_TOPIC_ARN_CLOUDTRAIL,
          Message: message,
        })
      );
    }

    await Utilities.deleteSQSMessage(SQS_URL, item);
  });

  await Promise.all(tasks);
};

// truncate();
// debug2();
// debugCloudTrail();
// newResources();
// transferToEvents();

// const test001 = () => {
//   const elbArn =
//     'arn:aws:elasticloadbalancing:ap-northeast-1:334678299258:loadbalancer/app/ecs-deploy-alb-jamin/d8964b0061860d1f';

//   console.log(elbArn.substring(0, elbArn.lastIndexOf('/')));
// };

// test001();
redrive();
