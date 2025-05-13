import { isEmpty } from 'lodash';
import { parse } from 'csv-parse/sync';
import {
  ami,
  deleteVpcEndpoint,
  deleteVpnGateway,
  route_table,
  security_group,
  snapshots,
  subnet,
  terminateEC2Instance,
} from './lib/ec2';
import { iam_user } from './lib/iam';
import { deleteAppStreamFleet } from './lib/appstream';
import { deleteAmplifyApp } from './lib/amplify';
import { deleteApiGatewayApi } from './lib/apigw';
import { deleteAppRunnerService } from './lib/apprunner';
import { deleteAutoScalingGroup } from './lib/autoscaling';
import { deleteBackupVault } from './lib/backup';
import { deleteCloudFormationStack } from './lib/cloudformation';
import { deleteCodeBuildProject } from './lib/codebuild';
import { deleteCodeCommitRepository } from './lib/codecommit';
import { deleteCodeDeployApplication } from './lib/codedeploy';
import { deleteCognitoIdentityPool, deleteCognitoUserPool } from './lib/cognito';
import { deleteConnectInstance } from './lib/connect';
import { deleteCloudFrontDistribution } from './lib/distribution';
import { deleteDirectoryServiceDirectory } from './lib/ds';
import { deleteDynamoDBTable } from './lib/dynamoDB';
import { deleteECRRepository } from './lib/ecr';
import { deleteECSCluster } from './lib/ecs';
import { deleteEFSFileSystem } from './lib/efs';
import { deleteElasticBeanstalkApplication } from './lib/elasticbeanstalk';
import { deleteLoadBalancer, deleteTargetGroup } from './lib/elb';
import { deleteElasticsearchDomain } from './lib/es';
import { deleteFirehoseDeliveryStream } from './lib/firehose';
import { deleteGlueDatabase } from './lib/glue';
import { deleteIotTopicRule } from './lib/iot';
import { deleteLambdaFunction } from './lib/lambda';
import { deleteLexBot } from './lib/lex';
import { deleteRDSDBInstance, deleteRDSDBCluster } from './lib/rds';
import { deleteRoute53HostedZone, deleteRoute53Profile } from './lib/route53';
import { deleteS3Bucket } from './lib/s3';
import { deleteSageMakerNotebookInstance } from './lib/sagemaker';
import { deleteSchedulerSchedule } from './lib/scheduler';
import { deleteStepFunctionStateMachine } from './lib/sfn';
import { deleteSNSTopic } from './lib/sns';
import { deleteSQSQueue } from './lib/sqs';
import { deleteTimestreamDatabase } from './lib/timestream';
import { deleteTransferServer } from './lib/transfer';
import { deleteGlobalAccelerator } from './lib/globalaccelerator';
import { reports } from '@src/apps/reports';
import { ResourcesCSV } from 'typings';

const unimplemented = async (id: string) => {
  console.error(`Unimplemented: ${id}`);
};

const handlers: Record<string, (id: string) => Promise<void>> = {
  // appsync
  APPSYNC_CreateGraphqlApi: (id: string) => unimplemented(id),
  // appsteam
  APPSTREAM_FLEET: (id: string) => deleteAppStreamFleet(id),
  // airflow
  AIRFLOW_CreateEnvironment: (id: string) => unimplemented(id),
  // amplify
  AMPLIFY_APPS: (id: string) => deleteAmplifyApp(id),
  // amazonmq
  AMAZONMQ_CreateBroker: (id: string) => unimplemented(id),
  // api gateway
  APIGATEWAY: (id: string) => deleteApiGatewayApi(id),
  APIGATEWAY_VPCLINKS: (id: string) => unimplemented(id),
  APIGATEWAY_DOMAINNAMES: (id: string) => unimplemented(id),
  // appmesh
  APPMESH_CreateMesh: (id: string) => unimplemented(id),
  // app runner
  APPRUNNER_SERVICE: (id: string) => deleteAppRunnerService(id),
  // autoscaling
  AUTOSCALING_AUTOSCALINGGROUP: (id: string) => deleteAutoScalingGroup(id),
  // batch
  BATCH_CreateComputeEnvironment: (id: string) => unimplemented(id),
  // backup
  BACKUP_BACKUPPLAN: (id: string) => unimplemented(id),
  BACKUP_BACKUPVAULT: (id: string) => deleteBackupVault(id),
  // cloud9
  CLOUD9_ENVIRONMENT: (id: string) => unimplemented(id),
  // cloud directory
  CLOUDDIRECTORY_DIRECTORY: (id: string) => deleteDirectoryServiceDirectory(id),
  // cloudformation
  CLOUDFORMATION_STACK: (id: string) => deleteCloudFormationStack(id),
  // cloudformation stackset
  // TODO: implement deleteCloudFormationStackSet
  CLOUDFORMATION_CreateStackSet: (id: string) => unimplemented(id),
  // cloudfront
  CLOUDFRONT_DISTRIBUTION: (id: string) => deleteCloudFrontDistribution(id),
  CLOUDFRONT_FUNCTION: (id: string) => unimplemented(id),
  // connect
  CONNECT_INSTANCE: (id: string) => deleteConnectInstance(id),
  // codebuild
  CODEBUILD_PROJECT: (id: string) => deleteCodeBuildProject(id),
  // codecommit
  CODECOMMIT: (id: string) => deleteCodeCommitRepository(id),
  // codedeploy
  CODEDEPLOY_APPLICATION: (id: string) => deleteCodeDeployApplication(id),
  // codeartifact
  CODEARTIFACT_REPOSITORY: (id: string) => unimplemented(id),
  // codepipeline
  CODEPIPELINE: (id: string) => unimplemented(id),
  // cognito
  'COGNITO-IDP_USERPOOL': (id: string) => deleteCognitoUserPool(id),
  'COGNITO-IDENTITY_IDENTITYPOOL': (id: string) => deleteCognitoIdentityPool(id),
  // databrew
  DATABREW_DATASET: (id: string) => unimplemented(id),
  // dynamodb
  DYNAMODB_TABLE: (id: string) => deleteDynamoDBTable(id),
  // dms
  DMS_INSTANCE: (id: string) => unimplemented(id),
  // ec2
  EC2_INSTANCE: (id: string) => terminateEC2Instance(id),
  EC2_CreateClientVpnEndpoint: (id: string) => unimplemented(id),
  EC2_CreateCustomerGateway: (id: string) => unimplemented(id),
  EC2_CreateInternetGateway: (id: string) => unimplemented(id),
  EC2_CreateLaunchTemplate: (id: string) => unimplemented(id),
  EC2_CreateNatGateway: (id: string) => unimplemented(id),
  EC2_CreateNetworkInsightsPath: (id: string) => unimplemented(id),
  EC2_CopySnapshot: (id: string) => unimplemented(id),
  EC2_CreateSnapshot: (id: string) => unimplemented(id),
  EC2_RestoreSnapshotFromRecycleBin: (id: string) => unimplemented(id),
  EC2_CreateSubnet: (id: string) => unimplemented(id),
  // TODO: implement deleteEC2TransitGateway
  EC2_TRANSITGATEWAY: (id: string) => unimplemented(id),
  EC2_CreateTransitGatewayRouteTable: (id: string) => unimplemented(id),
  EC2_CreateVolume: (id: string) => unimplemented(id),
  EC2_CreateVpc: (id: string) => unimplemented(id),
  EC2_VPCENDPOINT: (id: string) => deleteVpcEndpoint(id),
  // TODO: implement deleteEC2VpcPeeringConnection
  EC2_VPCPEERINGCONNECTION: (id: string) => unimplemented(id),
  EC2_CreateVpnConnection: (id: string) => unimplemented(id),
  EC2_VPNGATEWAY: (id: string) => deleteVpnGateway(id),
  EC2_CreateImage: (id: string) => unimplemented(id),
  EC2_AllocateAddress: (id: string) => unimplemented(id),
  EC2_CreateSecurityGroup: (id: string) => unimplemented(id),
  EC2_CreateRouteTable: (id: string) => unimplemented(id),
  // ecr
  ECR_REPOSITORY: (id: string) => deleteECRRepository(id),
  // ecs
  ECS_CLUSTER: (id: string) => deleteECSCluster(id),
  // elasticfilesystem
  ELASTICFILESYSTEM_FILESYSTEM: (id: string) => deleteEFSFileSystem(id),
  // eks
  EKS_CLUSTER: (id: string) => unimplemented(id),
  // elasticbeanstalk
  ELASTICBEANSTALK_APPLICATION: (id: string) => deleteElasticBeanstalkApplication(id),
  // elasticloadbalancing
  ELASTICLOADBALANCING_LOADBALANCER: (id: string) => deleteLoadBalancer(id),
  ELASTICLOADBALANCING_TARGETGROUP: (id: string) => deleteTargetGroup(id),
  // elasticsearch
  ES_DOMAIN: (id: string) => deleteElasticsearchDomain(id),
  // firehose
  FIREHOSE_DELIVERYSTREAM: (id: string) => deleteFirehoseDeliveryStream(id),
  // glue
  GLUE_CRAWLER: (id: string) => unimplemented(id),
  GLUE_DATABASE: (id: string) => deleteGlueDatabase(id),
  // iot
  IOT_RULE: (id: string) => deleteIotTopicRule(id),
  // lambda
  LAMBDA_FUNCTION: (id: string) => deleteLambdaFunction(id),
  // lex
  LEX_BOT: (id: string) => deleteLexBot(id),
  // rds
  RDS_CLUSTER: (id: string) => deleteRDSDBCluster(id),
  RDS_DB: (id: string) => deleteRDSDBInstance(id),
  RDS_CLUSTERPG: (id: string) => unimplemented(id),
  RDS_PG: (id: string) => unimplemented(id),
  RDS_CreateDBProxy: (id: string) => unimplemented(id),
  RDS_SUBGRP: (id: string) => unimplemented(id),
  RDS_OG: (id: string) => unimplemented(id),
  // route53
  ROUTE53_HOSTEDZONE: (id: string) => deleteRoute53HostedZone(id),
  // route53profiles
  ROUTE53PROFILES_PROFILE: (id: string) => deleteRoute53Profile(id),
  // route53resolver
  ROUTE53RESOLVER_RESOLVERENDPOINT: (id: string) => unimplemented(id),
  ROUTE53RESOLVER_RESOLVERRULE: (id: string) => unimplemented(id),
  // s3
  S3_BUCKET: (id: string) => deleteS3Bucket(id),
  // sagemaker
  SAGEMAKER_DOMAIN: (id: string) => unimplemented(id),
  SAGEMAKER_NOTEBOOKINSTANCE: (id: string) => deleteSageMakerNotebookInstance(id),
  // scheduler
  SCHEDULER_SCHEDULE: (id: string) => deleteSchedulerSchedule(id),
  // sfn
  STATES_STATEMACHINE: (id: string) => deleteStepFunctionStateMachine(id),
  // sns
  SNS: (id: string) => deleteSNSTopic(id),
  // sqs
  SQS: (id: string) => deleteSQSQueue(id),
  // timestream
  TIMESTREAM_DATABASE: (id: string) => deleteTimestreamDatabase(id),
  // transfer
  TRANSFER_SERVER: (id: string) => deleteTransferServer(id),

  ELASTICACHE_CreateCacheCluster: (id: string) => unimplemented(id),
  ELASTICACHE_CreateCacheSubnetGroup: (id: string) => unimplemented(id),
  FSX_CreateFileSystem: (id: string) => unimplemented(id),
  // globalaccelerator
  GLOBALACCELERATOR_ACCELERATOR: (id: string) => deleteGlobalAccelerator(id),
  GRAFANA_CreateWorkspace: (id: string) => unimplemented(id),
  KENDRA_CreateIndex: (id: string) => unimplemented(id),
  KAFKA_CreateClusterV2: (id: string) => unimplemented(id),
  KINESIS_CreateStream: (id: string) => unimplemented(id),
  KINESISANALYTICS_CreateApplication: (id: string) => unimplemented(id),
  LOGS_CreateLogGroup: (id: string) => unimplemented(id),
  'NETWORK-FIREWALL_CreateFirewall': (id: string) => unimplemented(id),
  NETWORKMONITOR_CreateMonitor: (id: string) => unimplemented(id),
  REDSHIFT_CreateCluster: (id: string) => unimplemented(id),
  SERVERLESSREPO_APPLICATIONS: (id: string) => unimplemented(id),
  S3EXPRESS_CreateBucket: (id: string) => unimplemented(id),
  SYNTHETICS_CreateCanary: (id: string) => unimplemented(id),
  WAFV2_CreateIPSet: (id: string) => unimplemented(id),
  WAFV2_CreateWebACL: (id: string) => unimplemented(id),
  EVENTS_PutRule: (id: string) => unimplemented(id),
  EVENTS_CreateEventBus: (id: string) => unimplemented(id),
  MONITORING_PutDashboard: (id: string) => unimplemented(id),
  MONITORING_PutMetricAlarm: (id: string) => unimplemented(id),
};

export const handler = async () => {
  await security_group();
  await subnet();
  await route_table();
  await ami();
  await snapshots();
  await iam_user();

  const resources = await reports();
  const records: ResourcesCSV[] = parse(resources.join('\n'), {
    columns: true,
    skip_empty_lines: true,
  });

  const targets = records.filter((item) => item.UserName.endsWith('@dxc.com'));

  for (let i = 0; i < targets.length; i++) {
    const resource = targets[i];
    const key = getKey(resource.ResourceId);
    const func = handlers[key];

    if (!func) {
      console.error(`No handler for resource: ${resource.ResourceId}`);
      continue;
    }

    await func(resource.ResourceId);
  }
};

const getKey = (arn: string) => {
  const splits = arn.split(':');

  if (isEmpty(splits[5])) {
    return splits[2].toUpperCase();
  }

  return `${splits[2].toUpperCase()}_${splits[5].replace('-', '').toUpperCase()}`;
};

// const sleep = async (ms: number) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true);
//     }, ms);
//   });
// };
