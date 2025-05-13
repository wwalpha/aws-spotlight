import { ami, route_table, security_group, snapshots, subnet } from './lib/ec2';
import { iam_user } from './lib/iam';
import { deleteAmplifyApp } from './lib/amplify';
import { deleteApiGatewayRestApi } from './lib/apigw';
import { deleteAppRunnerService } from './lib/apprunner';
import { deleteAutoScalingGroup } from './lib/autoscaling';
import { deleteBackupVault } from './lib/backup';
import { deleteCloudFormationStack } from './lib/cloudformation';
import { deleteCodeBuildProject } from './lib/codebuild';
import { deleteCodeCommitRepository } from './lib/codecommit';
import { deleteCodeDeployApplication } from './lib/codedeploy';
import { deleteCognitoUserPool } from './lib/cognito';
import { deleteConnectInstance } from './lib/connect';
import { deleteCloudFrontDistribution } from './lib/distribution';
import { deleteDirectoryServiceDirectory } from './lib/ds';
import { deleteDynamoDBTable } from './lib/dynamoDB';
import { deleteECRRepository } from './lib/ecr';
import { deleteECSCluster } from './lib/ecs';
import { deleteEFSFileSystem } from './lib/efs';
import { deleteElasticBeanstalkApplication } from './lib/elasticbeanstalk';
import { deleteLoadBalancer } from './lib/elb';
import { deleteTargetGroup } from './lib/elbt';
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
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

const LAMBDA_FUNCTION_NAME = process.env.LAMBDA_FUNCTION_NAME;

export const handler = async () => {
  // Example usage of imported functions
  // await security_group();
  // await subnet();
  // await route_table();
  // await ami();
  // await snapshots();
  // await iam_user();

  const client = new LambdaClient(); // リージョンを指定
  const command = new InvokeCommand({
    FunctionName: LAMBDA_FUNCTION_NAME,
    Payload: Buffer.from(JSON.stringify(payload)),
    InvocationType: 'RequestResponse',
  });
};

// handler();
