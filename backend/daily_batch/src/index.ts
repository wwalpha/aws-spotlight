import { AthenaClient, GetQueryExecutionCommand, StartQueryExecutionCommand } from '@aws-sdk/client-athena';
import { CopyObjectCommand, S3Client } from '@aws-sdk/client-s3';

const athenaClient = new AthenaClient();
const s3Client = new S3Client();
const BUCKET_NAME = process.env.BUCKET_NAME;

export const handler = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  await startQuery(year.toString(), month, day);
};

const startQuery = async (year: string, month: string, day: string) => {
  const query = `
    SELECT 
      COALESCE(useridentity.username, useridentity.sessioncontext.sessionissuer.username) as userName,
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
      recipientAccountId,
      serviceEventDetails,
      sharedEventId
    FROM
      default.cloudtrail_parquet2
    WHERE
      eventtime >= '${year}-${month}-${day}T00:00:00Z' 
      AND eventtime < '${year}-${month}-${day}T99:99:99Z'
      AND eventname not in (
        'StartInstances',
        'StopInstances',
        'ConsoleLogin',
        'BackupDeleted',
        'CreateBackup',
        'DeleteBackup',
        'DriverExecute',
        'CreateImage',
        'CreateLogGroup',
        'CreateLogStream',
      )
      and eventname not like 'Assume%'
      and eventname not like 'Add%'
      and eventname not like 'Assign%'
      and eventname not like 'Attach%'
      and eventname not like 'Associate%'
      and eventname not like 'Activate%'
      and eventname not like 'Admin%'
      and eventname not like 'Alter%'
      and eventname not like 'BackupJob%'
      and eventname not like 'Change%'
      and eventname not like 'Check%'
      and eventname not like 'Complete%'
      and eventname not like 'Deregister%'
      and eventname not like 'Describe%'
      and eventname not like 'Disable%'
      and eventname not like 'Disassociate%'
      and eventname not like 'Enable%'
      and eventname not like 'Get%'
      and eventname not like 'List%'
      and eventname not like 'Initiate%'
      and eventname not like 'Modify%'
      and eventname not like 'Notify%'
      and eventname not like 'Put%'
      and eventname not like 'Publish%'
      and eventname not like 'Resume%'
      and eventname not like 'Refresh%'
      and eventname not like 'Register%'
      and eventname not like 'Retry%'
      and eventname not like 'Reboot%'
      and eventname not like 'Respond%'
      and eventname not like 'List%'
      and eventname not like 'Initiate%'
      and eventname not like 'Modify%'
      and eventname not like 'Notify%'
      and eventname not like 'Put%'
      and eventname not like 'Publish%'
      and eventname not like 'List%'
      and eventname not like 'Initiate%'
      and eventname not like 'Modify%'
      and eventname not like 'Notify%'
      and eventname not like 'Put%'
      and eventname not like 'Publish%'
      and eventname not like 'Resume%'
      and eventname not like 'Refresh%'
      and eventname not like 'Register%'
      and eventname not like 'Retry%'
      and eventname not like 'Reboot%'
      and eventname not like 'Respond%'
      and eventname not like 'Remove%'
      and eventname not like 'Suspend%'
      and eventname not like 'Send%'
      and eventname not like 'Start%'
      and eventname not like 'Stream%'
      and eventname not like 'Set%'
      and eventname not like 'Stop%'
      and eventname not like 'Test%'
      and eventname not like 'Update%'
      and eventname not like 'Upload%'
      and eventname not like 'Use%'
      and eventname not like 'Untag%'
      and eventname not like 'Unsubscribe%'
      and eventname not like 'Unassign%'
      and eventname not like '%Tag%'
      and eventname not like '%LogStream%'
      and eventname not like '%Grant%'
      and eventname not like '%RecoveryPoint%'
      and eventname not like '%LayerUpload%'
      and eventname not like '%SecurityGroup%'
      and eventname not like '%Policy%'
      and eventname not like '%Snapshot%'
      and eventname not like '%Token%'
      and eventname not like '%NetworkInterface%'
      and eventname not like '%ForMgn'
      and eventname not like '%ForDrs'
      and eventname not like '%Session'
      and eventname not like '%DataChannel'
      and eventname not like '%Partition'
      and eventsource <> 'cloudshell.amazonaws.com'
      and not (eventsource = 'glue.amazonaws.com' and eventname = 'CreateTable')
`;

  // start athena query
  const cmd = await athenaClient.send(new StartQueryExecutionCommand({ QueryString: query, WorkGroup: 'primary' }));

  // wait for query to finish
  const result = await waitQuery(cmd.QueryExecutionId!);

  // copy result to s3 bucket
  await s3Client.send(
    new CopyObjectCommand({
      Bucket: BUCKET_NAME,
      CopySource: result.QueryExecution!.ResultConfiguration!.OutputLocation?.substring(5),
      Key: `CloudTrail/year=${year}/month=${month}/${year}${month}${day}.csv`,
    })
  );

  // repair index
  await athenaClient.send(
    new StartQueryExecutionCommand({ QueryString: 'MSCK REPAIR TABLE "cloudtrail_daily"', WorkGroup: 'primary' })
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
