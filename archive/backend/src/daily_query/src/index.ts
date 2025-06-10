import {
  AthenaClient,
  GetQueryExecutionCommand,
  GetQueryExecutionCommandOutput,
  StartQueryExecutionCommand,
} from '@aws-sdk/client-athena';
import { S3Client, CopyObjectCommand, waitUntilObjectExists } from '@aws-sdk/client-s3';

const ATHENA_WORKGROUP = process.env.ATHENA_WORKGROUP as string;
const ATHENA_DATABASE = process.env.ATHENA_DATABASE as string;
const ATHENA_TABLE = process.env.ATHENA_TABLE as string;
const CLOUDTRAIL_BUCKET = process.env.CLOUDTRAIL_BUCKET as string;
const CLOUDTRAIL_DEST_BUCKET = process.env.CLOUDTRAIL_DEST_BUCKET as string;

const client = new AthenaClient();
const s3Client = new S3Client();

const REGIONS = [
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
];

export const handler = async () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();

  // Drop partitions for all regions
  await dropPartition(yyyy, mm, dd);

  // Add partitions for all regions
  await addPartition(yyyy, mm, dd);

  // Run the query
  const queryString = `
    SELECT
      UserIdentity,
      EventTime,
      EventSource,
      EventName,
      SourceIPAddress,
      RequestParameters,
      ResponseElements,
      RequestId,
      EventId,
      Resources,
      EventType,
      RecipientAccountId,
      ServiceEventDetails
    FROM "${ATHENA_DATABASE}"."${ATHENA_TABLE}"
    WHERE
      year = '${yyyy}'
      and month = '${mm}'
      and day = '${dd}'
      and errorcode is null
      and readonly != 'true'
  `;

  const res = await startQuery(queryString);

  console.log(res?.QueryExecution?.ResultConfiguration);

  if (!res?.QueryExecution || !res.QueryExecution.ResultConfiguration) {
    return;
  }

  // Get the result location
  const resultLocation = res.QueryExecution.ResultConfiguration.OutputLocation;
  // Copy the result to the destination bucket
  const destinationBucket = CLOUDTRAIL_DEST_BUCKET;
  // The destination key is cloudtrail/YYYY/MM/DD/query_result.csv
  const destinationKey = `CloudTrail/${yyyy}/${mm}/${dd}/query_result.csv`;

  // Copy the result to the destination bucket
  const copyCmd = new CopyObjectCommand({
    CopySource: resultLocation?.substring(5),
    Bucket: destinationBucket,
    Key: destinationKey,
  });

  // Copy the result to the destination bucket
  await s3Client.send(copyCmd);

  // Wait for the object to exist
  await waitUntilObjectExists(
    { client: s3Client, maxWaitTime: 60 },
    { Bucket: destinationBucket, Key: destinationKey }
  );

  console.log(`Successfully copied.`);
};

// Drop and add partitions for the current date
const dropPartition = async (yyyy: number, mm: number, dd: number) => {
  const queryString = `
    ALTER TABLE "${ATHENA_DATABASE}"."${ATHENA_TABLE}" DROP 
    ${REGIONS.map((region) => `PARTITION (region='${region}', year='${yyyy}', month='${mm}', day='${dd}')`).join(', ')};
`;

  await startQuery(queryString, 10000);
};

// Add partitions for the current date
const addPartition = async (yyyy: number, mm: number, dd: number) => {
  const queryString = `
    ALTER TABLE "${ATHENA_DATABASE}"."${ATHENA_TABLE}" ADD
    ${REGIONS.map(
      (region) => `
      PARTITION (region='${region}', year='${yyyy}', month='${mm}', day='${dd}')
      LOCATION 's3://${CLOUDTRAIL_BUCKET}/cloudtrail-global/AWSLogs/334678299258/CloudTrail/${region}/${yyyy}/${mm}/${dd}/'
`
    ).join(' ')}
;`;

  await startQuery(queryString, 10000);
};

// Start the query and wait for it to complete
const startQuery = async (queryString: string, sleepTime: number = 30000) => {
  console.log('Starting query:', queryString);

  const queryCommand = new StartQueryExecutionCommand({
    QueryString: queryString,
    WorkGroup: ATHENA_WORKGROUP,
    QueryExecutionContext: {
      Database: ATHENA_DATABASE,
    },
  });

  // Start the query
  try {
    const queryRes = await client.send(queryCommand);

    // Wait for the query to complete
    return await waitExecutionComplete(queryRes.QueryExecutionId, sleepTime);
  } catch (e) {
    console.log(e);
  }
};

// Wait for the query to complete
const waitExecutionComplete = async (
  queryExecutionId?: string,
  sleepTime: number = 30000
): Promise<GetQueryExecutionCommandOutput | undefined> => {
  if (!queryExecutionId) {
    return;
  }

  const command = new GetQueryExecutionCommand({
    QueryExecutionId: queryExecutionId,
  });

  const res = await client.send(command);

  // If the query failed, throw an error
  if (res.QueryExecution?.Status?.State === 'FAILED') {
    console.log(res.QueryExecution);
    throw new Error('Query failed');
  }

  // If the query is still running, wait for 30 seconds before checking again
  if (res.QueryExecution?.Status?.State !== 'SUCCEEDED') {
    // wait for 30 seconds before checking again
    await sleep(sleepTime);

    await waitExecutionComplete(queryExecutionId);
  }

  return res;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

handler();
