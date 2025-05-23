import { ResourceService, SettingService } from '@src/services';
import { start as events } from './initialize/index';

export const start = async () => {
  await events();

  await SettingService.registReportFilter({
    Id: 'REPORT_FILTERS',
    Services: {
      iam: ['user', 'role', 'group'],
      ec2: ['subnet', 'volume', 'snapshot', 'network-insights-path', 'route-table', 'launch-template', 'elastic-ip'],
      rds: ['pg', 'subgrp', 'og', 'cluster-pg'],
    },
  });

  // arn:aws:lex:ap-northeast-1:334678299258:bot:test
  await ResourceService.registLatest({
    ResourceId: 'arn:aws:lex:ap-northeast-1:334678299258:bot:test',
    AWSRegion: 'ap-northeast-1',
    EventId: '99999999-6d19-4696-95f8-97e27ff57bad',
    EventName: 'DeleteBot',
    EventSource: 'lex.amazonaws.com',
    EventTime: '2021-07-30T05:21:23Z',
    Service: 'lex',
    Status: 'Deleted',
    UserName: 'Admin',
  });

  // arn:aws:iam::334678299258:role/ARMS_BatchServiceRole
  await ResourceService.registLatest({
    ResourceId: 'arn:aws:iam::334678299258:role/ARMS_BatchServiceRole',
    AWSRegion: 'us-east-1',
    EventId: '99999999-6d19-4696-95f8-97e27ff57bad',
    EventName: 'DeleteRole',
    EventSource: 'iam.amazonaws.com',
    EventTime: '2023-04-30T05:21:23Z',
    Service: 'IAM',
    Status: 'Deleted',
    UserName: 'ktou@dxc.com',
  });

  // arn:aws:iam::334678299258:role/EC2Role
  await ResourceService.registLatest({
    ResourceId: 'arn:aws:iam::334678299258:role/EC2Role',
    AWSRegion: 'us-east-1',
    EventId: '99999999-6d19-4696-95f8-97e27ff57bad',
    EventName: 'CreateRole',
    EventSource: 'iam.amazonaws.com',
    EventTime: '2020-10-12T05:21:23Z',
    Service: 'IAM',
    Status: 'Created',
    UserName: 'ktou@dxc.com',
  });

  // arn:aws:s3:::ma-bucket-sec
  await ResourceService.registLatest({
    ResourceId: 'arn:aws:s3:::ma-bucket-sec',
    AWSRegion: 'ap-northeast-1',
    EventId: '99999999-6d19-4696-95f8-97e27ff57bad',
    EventName: 'DeleteBucket',
    EventSource: 's3.amazonaws.com',
    EventTime: '2021-09-30T05:21:23Z',
    Service: 'S3',
    Status: 'Deleted',
    UserName: 'Admin',
  });

  // arn:aws:cloudformation:ap-northeast-1:334678299258:stackset/AWS-QuickSetup-SSMHostMgmt-LA-suwfw:aab47840-ccfd-4a08-84c3-fc8ccdac3eb4
  await ResourceService.registLatest({
    ResourceId:
      'arn:aws:cloudformation:ap-northeast-1:334678299258:stackset/AWS-QuickSetup-SSMHostMgmt-LA-suwfw:aab47840-ccfd-4a08-84c3-fc8ccdac3eb4',
    AWSRegion: 'ap-northeast-1',
    EventId: '99999999-6d19-4696-95f8-97e27ff57bad',
    EventName: 'DeleteStackSet',
    EventSource: 'cloudformation.amazonaws.com',
    EventTime: '2021-09-31T05:21:23Z',
    Service: 'CloudFormation',
    Status: 'Deleted',
    UserName: 'Admin',
  });

  // arn:aws:ec2:ap-northeast-1:334678299258:instance/i-03e595673e21aa69a
  await ResourceService.registLatest({
    ResourceId: 'arn:aws:ec2:ap-northeast-1:334678299258:instance/i-03e595673e21aa69a',
    AWSRegion: 'ap-northeast-1',
    EventId: '99999999-6d19-4696-95f8-97e27ff57bad',
    EventName: 'TerminateInstances',
    EventSource: 'ec2.amazonaws.com',
    EventTime: '2022-10-30T05:21:23Z',
    Service: 'EC2',
    Status: 'Deleted',
    UserName: 'Admin',
  });

  // arn:aws:cloudformation:ap-northeast-1:334678299258:stackset/AWS-QuickSetup-SSMHostMgmt-LA-t0x70:6dcebe54-c7aa-4637-b099-360f310d6845
  await ResourceService.registLatest({
    ResourceId:
      'arn:aws:cloudformation:ap-northeast-1:334678299258:stackset/AWS-QuickSetup-SSMHostMgmt-LA-t0x70:6dcebe54-c7aa-4637-b099-360f310d6845',
    AWSRegion: 'ap-northeast-1',
    EventId: '99999999-6d19-4696-95f8-97e27ff57bad',
    EventName: 'DeleteStackSet',
    EventSource: 'cloudformation.amazonaws.com',
    EventTime: '2022-11-30T05:21:23Z',
    Service: 'CloudFormation',
    Status: 'Deleted',
    UserName: 'Admin',
  });

  // arn:aws:sagemaker:ap-northeast-1:334678299258:domain/d-lvyasyudtzyf
  await ResourceService.registLatest({
    ResourceId: 'arn:aws:sagemaker:ap-northeast-1:334678299258:domain/d-lvyasyudtzyf',
    AWSRegion: 'ap-northeast-1',
    EventId: '99999999-6d19-4696-95f8-97e27ff57bad',
    EventName: 'DeleteDomain',
    EventSource: 'sagemaker.amazonaws.com',
    EventTime: '2022-11-30T05:21:23Z',
    Service: 'Sagemaker',
    Status: 'Deleted',
    UserName: 'Admin',
  });

  // arn:aws:rds:ap-northeast-1:334678299258:db:aurora-db-cluster-new-cluster
  await ResourceService.registLatest({
    ResourceId: 'arn:aws:rds:ap-northeast-1:334678299258:db:aurora-db-cluster-new-cluster',
    AWSRegion: 'ap-northeast-1',
    EventId: '99999999-6d19-4696-95f8-97e27ff57bad',
    EventName: 'DeleteDBInstance',
    EventSource: 'rds.amazonaws.com',
    EventTime: '2022-03-30T05:21:23Z',
    Service: 'RDS',
    Status: 'Deleted',
    UserName: 'Admin',
  });

  // arn:aws:rds:ap-northeast-1:334678299258:cluster:aurora-db-cluster-new-cluster
  await ResourceService.registLatest({
    ResourceId: 'arn:aws:rds:ap-northeast-1:334678299258:cluster:aurora-db-cluster-new-cluster',
    AWSRegion: 'ap-northeast-1',
    EventId: '99999999-6d19-4696-95f8-97e27ff57bad',
    EventName: 'DeleteDBCluster',
    EventSource: 'rds.amazonaws.com',
    EventTime: '2022-03-30T05:21:23Z',
    Service: 'RDS',
    Status: 'Deleted',
    UserName: 'Admin',
  });

  // arn:aws:rds:ap-northeast-1:334678299258:db:aurora-db-cluster
  await ResourceService.registLatest({
    ResourceId: 'arn:aws:rds:ap-northeast-1:334678299258:db:aurora-db-cluster',
    AWSRegion: 'ap-northeast-1',
    EventId: '99999999-6d19-4696-95f8-97e27ff57bad',
    EventName: 'DeleteDBInstance',
    EventSource: 'rds.amazonaws.com',
    EventTime: '2022-03-30T05:21:23Z',
    Service: 'RDS',
    Status: 'Deleted',
    UserName: 'Admin',
  });

  // arn:aws:rds:ap-northeast-1:334678299258:db:cis-rds-backup-test-recovery
  await ResourceService.registLatest({
    ResourceId: 'arn:aws:cloud9:ap-northeast-1:334678299258:environment:56d07bf600bc4f8f9dd304838f9ce9db',
    AWSRegion: 'ap-northeast-1',
    EventId: '0d686831-8e8b-4f1b-b69e-d674308c3447',
    EventName: 'CreateEnvironmentSSH',
    EventSource: 'cloud9.amazonaws.com',
    EventTime: '2024-01-17T03:50:13Z',
    ResourceName: 'iot-nml-test-existing-compute',
    Service: 'Cloud9',
    Status: 'Created',
    UserName: 'alvin.yee@dxc.com',
  });
};

start();
