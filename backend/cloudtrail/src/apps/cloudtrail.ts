import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { parse } from 'csv-parse/sync';
import { CloudTrail } from 'typings';

const client = new S3Client();

export const getRecords = async (bucket: string, key: string): Promise<CloudTrail.Record[]> => {
  // get object
  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

  if (response.Body == null) {
    throw new Error(`File downloaded failed. Bucket: ${bucket}, Key: ${key}`);
  }

  // transform stream to string
  const content = await response.Body.transformToString();

  const records: CloudTrail.Record[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
  });

  return records;
};
