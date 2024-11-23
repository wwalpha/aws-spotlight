import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as EXPECTS from '@test/expect/timestream';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('timestream.amazonaws.com', () => {
  test('TIMESTREAM_CreateDatabase', async () => {
    const event = await sendMessage(CreateEvents.TIMESTREAM_CreateDatabase);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:timestream:ap-northeast-1:999999999999:database/sampleDB');
    const history = await getHistory({ EventId: CreateEvents.TIMESTREAM_CreateDatabase.eventID });

    // fs.writeFileSync('TIMESTREAM_CreateDatabase_R.json', JSON.stringify(resource));
    // fs.writeFileSync('TIMESTREAM_CreateDatabase_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.TIMESTREAM_CreateDatabase_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.TIMESTREAM_CreateDatabase_H);
  });

  test('TIMESTREAM_DeleteDatabase', async () => {
    const event = await sendMessage(DeleteEvents.TIMESTREAM_DeleteDatabase);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:timestream:ap-northeast-1:999999999999:database/sampleDB');
    const history = await getHistory({ EventId: DeleteEvents.TIMESTREAM_DeleteDatabase.eventID });

    // fs.writeFileSync('TIMESTREAM_DeleteDatabase_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.TIMESTREAM_DeleteDatabase_H);
  });
});
