import { AthenaClient, GetQueryExecutionCommand, StartQueryExecutionCommand } from '@aws-sdk/client-athena';
import { CopyObjectCommand, S3Client } from '@aws-sdk/client-s3';

const athenaClient = new AthenaClient({ region: 'us-east-1' });
const s3Client = new S3Client({ region: 'us-east-1' });

const start = async () => {
  // await startQuery('2021', '06');
  // await startQuery('2021', '07');
  // await startQuery('2021', '08');
  // await startQuery('2021', '09');
  // await startQuery('2021', '10');
  // await startQuery('2021', '11');
  // await startQuery('2021', '12');
  // await startQuery('2022', '01');
  // await startQuery('2022', '02');
  // await startQuery('2022', '03');
  // await startQuery('2022', '04');
  // await startQuery('2022', '05');
  // await startQuery('2022', '06');
  // await startQuery('2022', '07');
  // await startQuery('2022', '08');
  // await startQuery('2022', '09');
  // await startQuery('2022', '10');
  // await startQuery('2022', '11');
  // await startQuery('2022', '12');
  // await startQuery('2023', '01');
  // await startQuery('2023', '02');
  // await startQuery('2023', '03');
  // await startQuery('2023', '04');
  // await startQuery('2023', '05');
  // await startQuery('2023', '06');
  // await startQuery('2023', '07');
  // await startQuery('2023', '08');
  // await startQuery('2023', '09');
  // await startQuery('2023', '10');
  // await startQuery('2023', '11');
  // await startQuery('2023', '12');
  // await startQuery('2024', '01');
  // await startQuery('2024', '02');
  // await startQuery('2024', '03');
  await startQuery('2024', '04');
  await startQuery('2024', '05');
  await startQuery('2024', '06');
  await startQuery('2024', '07');
  await startQuery('2024', '08');
  await startQuery('2024', '09');
  await startQuery('2024', '10');
  await startQuery('2024', '11');
};

const startQuery = async (year: string, month: string) => {
  console.log('startQuery', year, month);
  const query = `
    SELECT eventVersion,
      json_format(CAST(useridentity AS JSON)) AS userIdentity,
      eventTime,
      eventSource,
      eventName,
      awsRegion,
      sourceIPAddress,
      userAgent,
      requestParameters,
      responseElements,
      additionalEventData,
      requestId,
      eventId,
      json_format(CAST(resources AS JSON)) AS resources,
      eventType,
      apiVersion,
      recipientAccountId,
      serviceEventDetails,
      sharedEventId,
      vpcEndpointId,
      json_format(CAST(tlsDetails AS JSON)) AS tlsDetails
    FROM
      default.cloudtrail_parquet3
    WHERE
      eventtime >= '${year}-${month}-01T00:00:00Z' 
      AND eventtime < '${year}-${month}-99T00:00:00Z'
      AND eventname not in ('PutEvaluations', 'StartSession')
      AND eventname not like 'Notify%'
      AND eventname not like '%DataChannel%'`;

  const cmd = await athenaClient.send(new StartQueryExecutionCommand({ QueryString: query, WorkGroup: 'primary' }));

  const result = await waitQuery(cmd.QueryExecutionId!);

  await s3Client.send(
    new CopyObjectCommand({
      Bucket: 'spotlight-material-us-east-1-dev',
      CopySource: result.QueryExecution!.ResultConfiguration!.OutputLocation?.substring(5),
      Key: `CloudTrail/year=${year}/month=${month}/${year}${month}.csv`,
    })
  );
};

const waitQuery = async (queryExecutionId: string) => {
  for (;;) {
    sleep(1000);

    const result = await athenaClient.send(new GetQueryExecutionCommand({ QueryExecutionId: queryExecutionId }));

    if (result.QueryExecution?.Status?.State === 'SUCCEEDED') {
      return result;
    }
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

start();
