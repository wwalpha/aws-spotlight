export namespace CloudTrail {
  interface Event {
    Records: Record[];
  }

  interface Payload {
    s3Bucket: string;
    s3ObjectKey: string[];
  }

  interface Record {
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
    errorCode?: string;
    errorMessage?: string;
    requestParameters: any;
    responseElements: any;
    additionalEventData?: string;
    requestID: string;
    eventID: string;
    eventType: string;
    apiVersion?: string;
    managementEvent?: string;
    readOnly?: boolean;
    resources?: string;
    recipientAccountId: string;
    serviceEventDetails?: string;
    sharedEventId?: string;
    vpcEndpointId?: string;
    eventCategory: string;
    addendum?: string;
    sessionCredentialFromConsole?: string;
    edgeDeviceDetails?: string;
    tlsDetails?: string;
  }
}
