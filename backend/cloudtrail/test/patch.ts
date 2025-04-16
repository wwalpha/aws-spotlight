import { ResourceService, SettingService } from '@src/services';

const start = async () => {
  await SettingService.registReportFilter({
    Id: 'REPORT_FILTERS',
    Services: {
      iam: [''],
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
};

start();
