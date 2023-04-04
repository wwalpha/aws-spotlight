import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as EXPECTS from '@test/expect/glue';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('glue.amazonaws.com', () => {
  test('GLUE_CreateDatabase', async () => {
    const event = await sendMessage(CreateEvents.GLUE_CreateDatabase);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:glue:ap-northeast-1:999999999999:database/dar-database');
    const history = await getHistory({ EventId: CreateEvents.GLUE_CreateDatabase.eventID });

    // fs.writeFileSync('GLUE_CreateDatabase_R.json', JSON.stringify(resource));
    // fs.writeFileSync('GLUE_CreateDatabase_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.GLUE_CreateDatabase_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.GLUE_CreateDatabase_H);
  });

  test('GLUE_DeleteDatabase', async () => {
    const event = await sendMessage(DeleteEvents.GLUE_DeleteDatabase);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:glue:ap-northeast-1:999999999999:database/dar-database');
    const history = await getHistory({ EventId: DeleteEvents.GLUE_DeleteDatabase.eventID });

    // fs.writeFileSync('GLUE_DeleteDatabase_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.GLUE_DeleteDatabase_H);
  });
});
