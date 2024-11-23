export * from '../../typings/index';
import { Tables } from '../../typings/tables';

export interface CloudTrailRaw {
  eventTime: string;
  eventVersion: string;
  userIdentity: string;
  eventSource: string;
  eventName: string;
  awsRegion: string;
  sourceIPAddress: string;
  userAgent: string;
  requestParameters: string;
  responseElements: string;
  additionalEventData?: string;
  requestId: string;
  eventId: string;
  eventType: string;
  resources?: string;
  apiVersion?: string;
  recipientAccountId: string;
  serviceEventDetails?: string;
  sharedEventId?: string;
  vpcEndpointId?: string;
  tlsDetails?: string;
}

export interface CloudTrailRecord {
  eventTime: string;
  eventVersion: string;
  userIdentity: {
    type: string;
    username?: string;
    principalid: string;
    arn: string;
    accountid: string;
    accesskeyid: string;
    sessioncontext: {
      sessionissuer: {
        type: string;
        principalid: string;
        arn: string;
        accountid: string;
        username: string;
      };
      webidfederationdata: {};
      attributes: {
        mfaauthenticated: string;
        creationdate: string;
      };
    };
    invokedby: string;
  };
  eventSource: string;
  eventName: string;
  awsRegion: string;
  sourceIPAddress: string;
  userAgent: string;
  requestParameters: any;
  responseElements: any;
  additionalEventData?: string;
  requestId: string;
  eventId: string;
  eventType: string;
  apiVersion?: string;
  readOnly?: boolean;
  resources?: {
    ARN: string;
    accountId: string;
    type: string;
  }[];
  recipientAccountId: string;
  serviceEventDetails?: string;
  sharedEventId?: string;
  vpcEndpointId?: string;
  tlsDetails?: {
    tlsVersion: string;
    cipherSuite: string;
    clientProvidedHostHeader: string;
  };
}

export interface ResourceInfo {
  id: string;
  name?: string;
}
