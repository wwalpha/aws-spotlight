export * from '../../typings/index';
import { Tables } from '../../typings/tables';

export interface CloudTrailRaw {
  eventTime: string;
  eventSource: string;
  eventName: string;
  userName: string;
  awsRegion: string;
  sourceIPAddress: string;
  userAgent: string;
  requestParameters: string;
  responseElements: string;
  additionalEventData?: string;
  requestId: string;
  eventId: string;
  resources?: string;
  apiVersion?: string;
  recipientAccountId: string;
  serviceEventDetails?: string;
  sharedEventId?: string;
}

export interface CloudTrailRecord {
  eventTime: string;
  eventSource: string;
  eventName: string;
  userName: string;
  awsRegion: string;
  sourceIPAddress: string;
  userAgent: string;
  requestParameters: any;
  responseElements: any;
  additionalEventData?: string;
  requestId: string;
  eventId: string;
  resources?: {
    ARN: string;
    accountId: string;
    type: string;
  }[];
  recipientAccountId: string;
  serviceEventDetails?: string;
  sharedEventId?: string;
}

export interface ResourceInfo {
  id: string;
  name?: string;
}
