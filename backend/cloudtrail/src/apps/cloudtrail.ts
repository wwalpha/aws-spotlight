import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { parse } from 'csv-parse/sync';
import { CloudTrailRaw, CloudTrailRecord } from 'typings';

const client = new S3Client();

export const getRecords = async (bucket: string, key: string): Promise<CloudTrailRecord[]> => {
  // get object
  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

  if (response.Body == null) {
    throw new Error(`File downloaded failed. Bucket: ${bucket}, Key: ${key}`);
  }

  // transform stream to string
  const content = await response.Body.transformToString();

  const records: CloudTrailRaw[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
  });

  return records.map<CloudTrailRecord>((record) => ({
    eventTime: record.eventTime,
    eventVersion: record.eventVersion,
    userIdentity: JSON.parse(record.userIdentity),
    eventSource: record.eventSource,
    eventName: record.eventName,
    awsRegion: record.awsRegion,
    sourceIPAddress: record.sourceIPAddress,
    userAgent: record.userAgent,
    requestParameters: record.requestParameters !== '' ? record.requestParameters : undefined,
    responseElements: record.responseElements !== '' ? record.responseElements : undefined,
    additionalEventData: record.additionalEventData !== '' ? record.additionalEventData : undefined,
    requestId: record.requestId,
    eventId: record.eventId,
    eventType: record.eventType,
    resources: record.resources ? JSON.parse(record.resources) : undefined,
    apiVersion: record.apiVersion !== '' ? record.apiVersion : undefined,
    recipientAccountId: record.recipientAccountId,
    serviceEventDetails: record.serviceEventDetails !== '' ? record.serviceEventDetails : undefined,
    sharedEventId: record.sharedEventId !== '' ? record.sharedEventId : undefined,
    vpcEndpointId: record.vpcEndpointId !== '' ? record.vpcEndpointId : undefined,
    tlsDetails: record.tlsDetails ? JSON.parse(record.tlsDetails) : undefined,
  }));
};
