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
    userName?: string;
    principalId: string;
    arn: string;
    accountId: string;
    accessKeyId: string;
    sessionContext: {
      sessionIssuer: {
        type: string;
        principalId: string;
        arn: string;
        accountId: string;
        userName: string;
      };
      webIdFederationData: {};
      attributes: {
        mfaAuthenticated: string;
        creationDate: string;
      };
    };
    invokedBy: string;
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
