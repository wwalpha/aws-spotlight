import { defaultTo, capitalize } from 'lodash';
import { ResourceARNs } from '@src/apps/utils/awsArns';
import { CloudTrail, Tables } from 'typings';

export const start = (record: CloudTrail.Record): Tables.TResource | undefined => {
  const serviceName = record.eventSource.split('.')[0].toUpperCase();

  const infos = getResourceInfo(record);

  if (!infos) return undefined;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: infos[0],
    ResourceName: infos[1],
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: getServiceName(serviceName),
  };
};

const getResourceInfo = (record: CloudTrail.Record): string[] | undefined => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const key = `${record.eventSource.split('.')[0].toUpperCase()}_${record.eventName}`;
  let name = '';

  switch (key) {
    case 'EVENTS_PutRule':
      return [record.responseElements.ruleArn, record.requestParameters.name];
    case 'MONITORING_PutDashboard':
      name = record.requestParameters.dashboardName;
      return [ResourceARNs.MONITORING_Dashboard(region, account, name), name];
    case 'MONITORING_PutMetricAlarm':
      name = record.requestParameters.alarmName;
      return [ResourceARNs.MONITORING_Alarm(region, account, name), name];
  }

  return undefined;
};

const UPPERCASE = ['EC2', 'RDS', 'IAM', 'SNS', 'SQS', 'ECS', 'ECR', 'EKS', 'DMS'];

const getServiceName = (serviceName: string) => {
  if (UPPERCASE.includes(serviceName)) return serviceName;

  if (serviceName === 'STATES') return 'StepFunction';
  if (serviceName === 'LOGS') return 'CloudWatchLogs';
  if (serviceName === 'ES') return 'Elasticsearch';
  if (serviceName === 'DS') return 'DirectoryService';

  return capitalize(serviceName);
};
