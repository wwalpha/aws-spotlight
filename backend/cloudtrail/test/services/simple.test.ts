import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from '@test/datas';
import * as EXPECTS from '@test/expect/simple';
import * as fs from 'fs';

// fs.writeFileSync('./test/expect/simple/AUTOSCALING_CreateAutoScalingGroup.json', JSON.stringify(resource));
// expect(resource).not.toBeUndefined();
// // expect(resource).toEqual(EXPECTS.AUTOSCALING_CreateAutoScalingGroup);

describe.skip('autoscaling.amazonaws.com', () => {
  test('AUTOSCALING_CreateAutoScalingGroup', async () => {
    const event = await sendMessage(Events.AUTOSCALING_CreateAutoScalingGroup);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:autoscaling:ap-northeast-1:999999999999:autoScalingGroup:*:autoScalingGroupName/ws-dev-autoscaling-1'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.AUTOSCALING_CreateAutoScalingGroup);
  });

  test('AUTOSCALING_DeleteAutoScalingGroup', async () => {
    const event = await sendMessage(Events.AUTOSCALING_DeleteAutoScalingGroup);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:autoscaling:ap-northeast-1:999999999999:autoScalingGroup:*:autoScalingGroupName/ws-dev-autoscaling-1'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.AUTOSCALING_DeleteAutoScalingGroup);
  });
});

describe.skip('batch.amazonaws.com', () => {
  test('BATCH_CreateComputeEnvironment', async () => {
    const event = await sendMessage(Events.BATCH_CreateComputeEnvironment);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:batch:ap-northeast-1:999999999999:compute-environment/first-run-compute-environment'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.BATCH_CreateComputeEnvironment);
  });

  test('BATCH_DeleteComputeEnvironment', async () => {
    const event = await sendMessage(Events.BATCH_DeleteComputeEnvironment);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:batch:ap-northeast-1:999999999999:compute-environment/first-run-compute-environment'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.BATCH_DeleteComputeEnvironment);
  });
});

describe.skip('cloudfront.amazonaws.com', () => {
  test('CLOUDFRONT_CreateDistribution', async () => {
    const event = await sendMessage(Events.CLOUDFRONT_CreateDistribution);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudfront::999999999999:distribution/E1AU9D0469FO98');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CLOUDFRONT_CreateDistribution);
  });

  test('CLOUDFRONT_DeleteDistribution', async () => {
    const event = await sendMessage(Events.CLOUDFRONT_DeleteDistribution);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloudfront::999999999999:distribution/E1AU9D0469FO98');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CLOUDFRONT_DeleteDistribution);
  });
});

describe.skip('cloudformation.amazonaws.com', () => {
  test('CLOUDFORMATION_CreateStack', async () => {
    const event = await sendMessage(Events.CLOUDFORMATION_CreateStack);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:cloudformation:ap-northeast-1:999999999999:stack/StackSet-AWS-QuickSetup-SSMHostMgmt-LA-qm255-1ba8b947-4616-48a1-9d95-535b245c559c'
    );
    fs.writeFileSync('./test/expect/simple/CLOUDFORMATION_CreateStack.json', JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.CLOUDFORMATION_CreateStack);
  });

  test('CLOUDFORMATION_DeleteStack', async () => {
    const event = await sendMessage(Events.CLOUDFORMATION_DeleteStack);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:cloudformation:ap-northeast-1:999999999999:stack/StackSet-AWS-QuickSetup-SSMHostMgmt-LA-qm255-1ba8b947-4616-48a1-9d95-535b245c559c'
    );
    fs.writeFileSync('./test/expect/simple/CLOUDFORMATION_DeleteStack.json', JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.CLOUDFORMATION_DeleteStack);
  });
});

describe.skip('codebuild.amazonaws.com', () => {
  test('CODEBUILD_CreateProject', async () => {
    const event = await sendMessage(Events.CODEBUILD_CreateProject);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:codebuild:ap-northeast-1:999999999999:project/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEBUILD_CreateProject);
  });

  test('CODEBUILD_DeleteProject', async () => {
    const event = await sendMessage(Events.CODEBUILD_DeleteProject);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:codebuild:ap-northeast-1:999999999999:project/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEBUILD_DeleteProject);
  });
});

describe.skip('codedeploy.amazonaws.com', () => {
  test('CODEDEPLOY_CreateApplication', async () => {
    const event = await sendMessage(Events.CODEDEPLOY_CreateApplication);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:codedeploy:ap-northeast-1:999999999999:application/Nodejs');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEDEPLOY_CreateApplication);
  });

  test('CODEDEPLOY_DeleteApplication', async () => {
    const event = await sendMessage(Events.CODEDEPLOY_DeleteApplication);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:codedeploy:ap-northeast-1:999999999999:application/Nodejs');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEDEPLOY_DeleteApplication);
  });
});
