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

describe.skip('cloudformation.amazonaws.com', () => {
  test('CLOUDFORMATION_CreateStack', async () => {
    const event = await sendMessage(Events.CLOUDFORMATION_CreateStack);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:cloudformation:ap-northeast-1:999999999999:stack/StackSet-AWS-QuickSetup-SSMHostMgmt-LA-qm255-1ba8b947-4616-48a1-9d95-535b245c559c'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CLOUDFORMATION_CreateStack);
  });

  test('CLOUDFORMATION_DeleteStack', async () => {
    const event = await sendMessage(Events.CLOUDFORMATION_DeleteStack);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:cloudformation:ap-northeast-1:999999999999:stack/StackSet-AWS-QuickSetup-SSMHostMgmt-LA-qm255-1ba8b947-4616-48a1-9d95-535b245c559c'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CLOUDFORMATION_DeleteStack);
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

describe.skip('dms.amazonaws.com', () => {
  test('DMS_CreateReplicationInstance', async () => {
    const event = await sendMessage(Events.DMS_CreateReplicationInstance);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:dms:ap-northeast-1:999999999999:rep:IMG2PDS3YLM3PFGOMBNEY7LMODJ2Q4YA5AMOJLA'
    );
    fs.writeFileSync('./test/expect/simple/DMS_CreateReplicationInstance.json', JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.DMS_CreateReplicationInstance);
  });

  test('DMS_DeleteReplicationInstance', async () => {
    const event = await sendMessage(Events.DMS_DeleteReplicationInstance);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:dms:ap-northeast-1:999999999999:rep:IMG2PDS3YLM3PFGOMBNEY7LMODJ2Q4YA5AMOJLA'
    );
    fs.writeFileSync('./test/expect/simple/DMS_DeleteReplicationInstance.json', JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.DMS_DeleteReplicationInstance);
  });
});

describe.skip('dynamodb.amazonaws.com', () => {
  test('CreateTable', async () => {
    const event = await sendMessage(Events.DYNAMODB_CreateTable);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.DYNAMODB_CreateTable);
  });

  test('DeleteTable', async () => {
    const event = await sendMessage(Events.DYNAMODB_DeleteTable);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.DYNAMODB_DeleteTable);
  });
});

describe.skip('ecr.amazonaws.com', () => {
  test('ECR_CreateRepository', async () => {
    const event = await sendMessage(Events.ECR_CreateRepository);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ecr:ap-northeast-1:999999999999:repository/nodejs-blue');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ECR_CreateRepository);
  });

  test('ECR_DeleteRepository', async () => {
    const event = await sendMessage(Events.ECR_DeleteRepository);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ecr:ap-northeast-1:999999999999:repository/nodejs-blue');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ECR_DeleteRepository);
  });
});

describe.skip('ecs.amazonaws.com', () => {
  test('ECS_CreateCluster', async () => {
    const event = await sendMessage(Events.ECS_CreateCluster);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:ecs:ap-northeast-1:999999999999:cluster/arms-cluster');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ECS_CreateCluster);
  });

  test('ECS_DeleteCluster', async () => {
    const event = await sendMessage(Events.ECS_DeleteCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ecs:ap-northeast-1:999999999999:cluster/arms-cluster');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ECS_DeleteCluster);
  });
});

describe.skip('elasticfilesystem.amazonaws.com', () => {
  test('ELASTICFILESYSTEM_CreateFileSystem', async () => {
    const event = await sendMessage(Events.ELASTICFILESYSTEM_CreateFileSystem);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:elasticfilesystem:ap-northeast-1:999999999999:file-system/fs-d536f8f5');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ELASTICFILESYSTEM_CreateFileSystem);
  });

  test('ELASTICFILESYSTEM_DeleteFileSystem', async () => {
    const event = await sendMessage(Events.ELASTICFILESYSTEM_DeleteFileSystem);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:elasticfilesystem:ap-northeast-1:999999999999:file-system/fs-d536f8f5');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ELASTICFILESYSTEM_DeleteFileSystem);
  });
});

describe.skip('eks.amazonaws.com', () => {
  test('EKS_CreateCluster', async () => {
    const event = await sendMessage(Events.EKS_CreateCluster);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:eks:ap-northeast-1:999999999999:cluster/eks-cluster');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EKS_CreateCluster);
  });

  test('EKS_DeleteCluster', async () => {
    const event = await sendMessage(Events.EKS_DeleteCluster);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:eks:ap-northeast-1:999999999999:cluster/eks-cluster');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EKS_DeleteCluster);
  });
});

describe.skip('es.amazonaws.com', () => {
  test('ES_CreateElasticsearchDomain', async () => {
    const event = await sendMessage(Events.ES_CreateElasticsearchDomain);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:es:ap-northeast-1:999999999999:domain/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ES_CreateElasticsearchDomain);
  });

  test('ES_DeleteElasticsearchDomain', async () => {
    const event = await sendMessage(Events.ES_DeleteElasticsearchDomain);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:es:ap-northeast-1:999999999999:domain/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ES_DeleteElasticsearchDomain);
  });
});

describe.skip('fsx.amazonaws.com', () => {
  test('FSX_CreateFileSystem', async () => {
    const event = await sendMessage(Events.FSX_CreateFileSystem);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:fsx:ap-northeast-1:999999999999:file-system/fs-01975f073c6852d99');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.FSX_CreateFileSystem);
  });

  test('FSX_DeleteFileSystem', async () => {
    const event = await sendMessage(Events.FSX_DeleteFileSystem);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:fsx:ap-northeast-1:999999999999:file-system/fs-01975f073c6852d99');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.FSX_DeleteFileSystem);
  });
});

describe.skip('glue.amazonaws.com', () => {
  test('GLUE_CreateDatabase', async () => {
    const event = await sendMessage(Events.GLUE_CreateDatabase);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:glue:ap-northeast-1:999999999999:database/dar-database');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.GLUE_CreateDatabase);
  });

  test('GLUE_DeleteDatabase', async () => {
    const event = await sendMessage(Events.GLUE_DeleteDatabase);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:glue:ap-northeast-1:999999999999:database/dar-database');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.GLUE_DeleteDatabase);
  });
});

describe.skip('iot.amazonaws.com', () => {
  test('IOT_CreateTopicRule', async () => {
    const event = await sendMessage(Events.IOT_CreateTopicRule);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:iot:ap-northeast-1:999999999999:rule/darRule');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.IOT_CreateTopicRule);
  });

  test('IOT_DeleteTopicRule', async () => {
    const event = await sendMessage(Events.IOT_DeleteTopicRule);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:iot:ap-northeast-1:999999999999:rule/darRule');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.IOT_DeleteTopicRule);
  });
});

describe.skip('kinesis.amazonaws.com', () => {
  test('KINESIS_CreateStream', async () => {
    const event = await sendMessage(Events.KINESIS_CreateStream);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:kinesis:ap-northeast-1:999999999999:stream/engagement');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.KINESIS_CreateStream);
  });

  test('KINESIS_DeleteStream', async () => {
    const event = await sendMessage(Events.KINESIS_DeleteStream);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:kinesis:ap-northeast-1:999999999999:stream/engagement');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.KINESIS_DeleteStream);
  });

  test('KINESIS_CreateApplication', async () => {
    const event = await sendMessage(Events.KINESIS_CreateApplication);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:kinesisanalytics:ap-northeast-1:999999999999:application/KinesisDataAnalytics_Test'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.KINESIS_CreateApplication);
  });

  test('KINESIS_DeleteApplication', async () => {
    const event = await sendMessage(Events.KINESIS_DeleteApplication);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:kinesisanalytics:ap-northeast-1:999999999999:application/KinesisDataAnalytics_Test'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.KINESIS_DeleteApplication);
  });
});

describe.skip('lambda.amazonaws.com', () => {
  test('LAMBDA_CreateFunction20150331', async () => {
    const event = await sendMessage(Events.LAMBDA_CreateFunction20150331);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:lambda:ap-northeast-1:999999999999:function:RekogDemoSetupEngagementMeter'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.LAMBDA_CreateFunction20150331);
  });

  test('LAMBDA_DeleteFunction20150331', async () => {
    const event = await sendMessage(Events.LAMBDA_DeleteFunction20150331);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:lambda:ap-northeast-1:999999999999:function:RekogDemoSetupEngagementMeter'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.LAMBDA_DeleteFunction20150331);
  });
});

describe.skip('lex.amazonaws.com', () => {
  test('LEX_CreateBot', async () => {
    const event = await sendMessage(Events.LEX_CreateBot);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:lex:ap-northeast-1:999999999999:bot:multichannel_lex_bot');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.LEX_CreateBot);
  });

  test('LEX_DeleteBot', async () => {
    const event = await sendMessage(Events.LEX_DeleteBot);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:lex:ap-northeast-1:999999999999:bot:multichannel_lex_bot');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.LEX_DeleteBot);
  });
});

describe.skip('network-firewall.amazonaws.com', () => {
  test('NFW_CreateFirewall', async () => {
    const event = await sendMessage(Events.NFW_CreateFirewall);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:network-firewall:ap-northeast-1:999999999999:firewall/Sjin6-Firewall');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.NFW_CreateFirewall);
  });

  test('NFW_DeleteFirewall', async () => {
    const event = await sendMessage(Events.NFW_DeleteFirewall);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:network-firewall:ap-northeast-1:999999999999:firewall/Sjin6-Firewall');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.NFW_DeleteFirewall);
  });
});

describe.skip('redshift.amazonaws.com', () => {
  test('REDSHIFT_CreateCluster', async () => {
    const event = await sendMessage(Events.REDSHIFT_CreateCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:redshift:us-east-1:999999999999:cluster:redshift-cluster-1');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.REDSHIFT_CreateCluster);
  });

  test('REDSHIFT_DeleteCluster', async () => {
    const event = await sendMessage(Events.REDSHIFT_DeleteCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:redshift:us-east-1:999999999999:cluster:redshift-cluster-1');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.REDSHIFT_DeleteCluster);
  });
});

describe.skip('route53.amazonaws.com', () => {
  test('ROUTE53_CreateHostedZone', async () => {
    const event = await sendMessage(Events.ROUTE53_CreateHostedZone);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:route53:::hostedzone/AAAAAAAAAAAAAAAA');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ROUTE53_CreateHostedZone);
  });

  test('ROUTE53_DeleteHostedZone', async () => {
    const event = await sendMessage(Events.ROUTE53_DeleteHostedZone);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:route53:::hostedzone/AAAAAAAAAAAAAAAA');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ROUTE53_DeleteHostedZone);
  });
});

describe.skip('s3.amazonaws.com', () => {
  test('CreateBucket', async () => {
    const event = await sendMessage(Events.S3_CreateBucket);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:s3:::test-backt-testfile01');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.S3_CreateBucket);
  });

  test('DeleteBucket', async () => {
    const event = await sendMessage(Events.S3_DeleteBucket);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:s3:::test-backt-testfile01');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.S3_DeleteBucket);
  });
});

describe.skip('sns.amazonaws.com', () => {
  test('SNS_CreateTopic', async () => {
    const event = await sendMessage(Events.SNS_CreateTopic);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:sns:us-east-1:999999999999:arms-admin');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SNS_CreateTopic);
  });

  test('SNS_DeleteTopic', async () => {
    const event = await sendMessage(Events.SNS_DeleteTopic);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:sns:us-east-1:999999999999:arms-admin');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SNS_DeleteTopic);
  });
});

describe.skip('sqs.amazonaws.com', () => {
  test('SQS_CreateQueue', async () => {
    const event = await sendMessage(Events.SQS_CreateQueue);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:sqs:us-east-1:999999999999:arms-deadletter');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SQS_CreateQueue);
  });

  test('SQS_DeleteQueue', async () => {
    const event = await sendMessage(Events.SQS_DeleteQueue);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:sqs:us-east-1:999999999999:arms-deadletter');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SQS_DeleteQueue);
  });
});

describe.skip('states.amazonaws.com', () => {
  test('STATES_CreateStateMachine', async () => {
    const event = await sendMessage(Events.STATES_CreateStateMachine);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:states:ap-northeast-1:999999999999:stateMachine:BLyi9R1Js89B');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.STATES_CreateStateMachine);
  });

  test('STATES_DeleteStateMachine', async () => {
    const event = await sendMessage(Events.STATES_DeleteStateMachine);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:states:ap-northeast-1:999999999999:stateMachine:BLyi9R1Js89B');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.STATES_DeleteStateMachine);
  });
});

describe.skip('synthetics.amazonaws.com', () => {
  test('SYNTHETICS_CreateCanary', async () => {
    const event = await sendMessage(Events.SYNTHETICS_CreateCanary);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:synthetics:us-east-1:999999999999:canary:audit-region');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SYNTHETICS_CreateCanary);
  });

  test('SYNTHETICS_DeleteCanary', async () => {
    const event = await sendMessage(Events.SYNTHETICS_DeleteCanary);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:synthetics:us-east-1:999999999999:canary:audit-region');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SYNTHETICS_DeleteCanary);
  });
});

describe.skip('timestream.amazonaws.com', () => {
  test('TIMESTREAM_CreateDatabase', async () => {
    const event = await sendMessage(Events.TIMESTREAM_CreateDatabase);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:timestream:ap-northeast-1:999999999999:database/sampleDB');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.TIMESTREAM_CreateDatabase);
  });

  test('TIMESTREAM_DeleteDatabase', async () => {
    const event = await sendMessage(Events.TIMESTREAM_DeleteDatabase);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:timestream:ap-northeast-1:999999999999:database/sampleDB');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.TIMESTREAM_DeleteDatabase);
  });
});

describe.skip('transfer.amazonaws.com', () => {
  test('TRANSFER_CreateServer', async () => {
    const event = await sendMessage(Events.TRANSFER_CreateServer);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:transfer:ap-northeast-1:999999999999:server/s-61ada58e71d74f8da');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.TRANSFER_CreateServer);
  });

  test('TRANSFER_DeleteServer', async () => {
    const event = await sendMessage(Events.TRANSFER_DeleteServer);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:transfer:ap-northeast-1:999999999999:server/s-61ada58e71d74f8da');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.TRANSFER_DeleteServer);
  });
});

describe.skip('wafv2.amazonaws.com', () => {
  test('WAFV2_CreateIPSet', async () => {
    const event = await sendMessage(Events.WAFV2_CreateIPSet);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:wafv2:ap-northeast-1:999999999999:regional/ipset/IPSET1');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.WAFV2_CreateIPSet);
  });

  test('WAFV2_DeleteIPSet', async () => {
    const event = await sendMessage(Events.WAFV2_DeleteIPSet);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:wafv2:ap-northeast-1:999999999999:regional/ipset/IPSET1');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.WAFV2_DeleteIPSet);
  });

  test('WAFV2_CreateWebACL', async () => {
    const event = await sendMessage(Events.WAFV2_CreateWebACL);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:wafv2:ap-northeast-1:999999999999:regional/webacl/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.WAFV2_CreateWebACL);
  });

  test('WAFV2_DeleteWebACL', async () => {
    const event = await sendMessage(Events.WAFV2_DeleteWebACL);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:wafv2:ap-northeast-1:999999999999:regional/webacl/test');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.WAFV2_DeleteWebACL);
  });
});
