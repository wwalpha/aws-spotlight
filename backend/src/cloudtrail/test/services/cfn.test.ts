import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as EXPECTS from '@test/expect/cloudformation';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('cloudformation.amazonaws.com', () => {
  test('CLOUDFORMATION_CreateStack', async () => {
    const event = await sendMessage(CreateEvents.CLOUDFORMATION_CreateStack);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:cloudformation:ap-northeast-1:999999999999:stack/StackSet-AWS-QuickSetup-SSMHostMgmt-LA-qm255-1ba8b947-4616-48a1-9d95-535b245c559c/0c24cd50-9d13-11eb-8b86-0efc49622d27'
    );
    const history = await getHistory({ EventId: CreateEvents.CLOUDFORMATION_CreateStack.eventID });

    // fs.writeFileSync('CLOUDFORMATION_CreateStack_R.json', JSON.stringify(resource));
    // fs.writeFileSync('CLOUDFORMATION_CreateStack_H.json', JSON.stringify(history));
    fs.writeFileSync('./test/expect/cloudformation/CLOUDFORMATION_CreateStack_R.json', JSON.stringify(resource));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CLOUDFORMATION_CreateStack_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.CLOUDFORMATION_CreateStack_H);
  });

  test('CLOUDFORMATION_DeleteStack', async () => {
    const event = await sendMessage(DeleteEvents.CLOUDFORMATION_DeleteStack);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:cloudformation:ap-northeast-1:999999999999:stack/StackSet-AWS-QuickSetup-SSMHostMgmt-LA-qm255-1ba8b947-4616-48a1-9d95-535b245c559c/0c24cd50-9d13-11eb-8b86-0efc49622d27'
    );
    const history = await getHistory({ EventId: DeleteEvents.CLOUDFORMATION_DeleteStack.eventID });

    fs.writeFileSync('./test/expect/cloudformation/CLOUDFORMATION_DeleteStack_R.json', JSON.stringify(resource));
    // fs.writeFileSync('CLOUDFORMATION_DeleteStack_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.CLOUDFORMATION_DeleteStack_H);
  });
});
