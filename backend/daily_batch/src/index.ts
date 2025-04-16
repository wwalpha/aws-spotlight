import { AthenaClient, GetQueryExecutionCommand, StartQueryExecutionCommand } from '@aws-sdk/client-athena';
import { CopyObjectCommand, S3Client } from '@aws-sdk/client-s3';

const athenaClient = new AthenaClient();
const s3Client = new S3Client();
const BUCKET_NAME = process.env.BUCKET_NAME;
const ATHENA_WORKGROUP = process.env.ATHENA_WORKGROUP;
const ATHENA_TABLE_NAME = process.env.ATHENA_TABLE_NAME;

export const handler = async () => {
  const now = new Date();
  // yesterday
  const date = new Date(now);
  date.setDate(now.getDate() - 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  await startQuery(year.toString(), month, day);
};

const startQuery = async (year: string, month: string, day?: string) => {
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
    FROM "default"."cloudtrail_logs_global_v1"
    WHERE
      region IN (
        'ap-northeast-1',
        'ap-northeast-2',
        'ap-northeast-3',
        'ap-south-1',
        'ap-southeast-1',
        'ap-southeast-2',
        'ca-central-1',
        'eu-central-1',
        'eu-north-1',
        'eu-west-1',
        'eu-west-2',
        'eu-west-3',
        'me-central-1',
        'sa-east-1',
        'us-east-1',
        'us-east-2',
        'us-west-1',
        'us-west-2'
      )
      AND ${getCondition(year, month, day)}
      AND readonly = 'false'
      AND errorcode IS NULL
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
        'CreateLogStream'
      )
      AND eventname not like 'Assume%'
      AND eventname not like 'Add%'
      AND eventname not like 'Assign%'
      AND eventname not like 'Attach%'
      AND eventname not like 'Associate%'
      AND eventname not like 'Activate%'
      AND eventname not like 'Admin%'
      AND eventname not like 'Alter%'
      AND eventname not like 'BackupJob%'
      AND eventname not like 'Change%'
      AND eventname not like 'Check%'
      AND eventname not like 'Complete%'
      AND eventname not like 'Deregister%'
      AND eventname not like 'Describe%'
      AND eventname not like 'Disable%'
      AND eventname not like 'Disassociate%'
      AND eventname not like 'Enable%'
      AND eventname not like 'Get%'
      AND eventname not like 'List%'
      AND eventname not like 'Initiate%'
      AND eventname not like 'Modify%'
      AND eventname not like 'Notify%'
      AND eventname not like 'Put%'
      AND eventname not like 'Publish%'
      AND eventname not like 'Resume%'
      AND eventname not like 'Refresh%'
      AND eventname not like 'Retry%'
      AND eventname not like 'Reboot%'
      AND eventname not like 'Respond%'
      AND eventname not like 'Remove%'
      AND eventname not like 'Suspend%'
      AND eventname not like 'Send%'
      AND eventname not like 'Start%'
      AND eventname not like 'Stream%'
      AND eventname not like 'Set%'
      AND eventname not like 'Stop%'
      AND eventname not like 'Test%'
      AND eventname not like 'Update%'
      AND eventname not like 'Upload%'
      AND eventname not like 'Use%'
      AND eventname not like 'Untag%'
      AND eventname not like 'Unsubscribe%'
      AND eventname not like 'Unassign%'
      AND eventname not like '%Tag%'
      AND eventname not like '%LogStream%'
      AND eventname not like '%Grant%'
      AND eventname not like '%RecoveryPoint%'
      AND eventname not like '%LayerUpload%'
      AND eventname not like '%SecurityGroup%'
      AND eventname not like '%Policy%'
      AND eventname not like '%Snapshot%'
      AND eventname not like '%Token%'
      AND eventname not like '%NetworkInterface%'
      AND eventname not like '%ForMgn'
      AND eventname not like '%ForDrs'
      AND eventname not like '%Session'
      AND eventname not like '%DataChannel'
      AND eventname not like '%Partition'
      AND eventsource <> 'cloudshell.amazonaws.com'
      AND not (eventsource = 'glue.amazonaws.com' AND eventname = 'CreateTable')
      AND not (eventsource = 'sns.amazonaws.com' AND eventname = 'Subscribe')
      AND not (eventsource = 'ec2.amazonaws.com' AND eventname IN ('DeleteRoute', 'CreateRoute', 'ReplaceRoute'))
`;

  // start athena query
  const cmd = await athenaClient.send(
    new StartQueryExecutionCommand({ QueryString: query, WorkGroup: ATHENA_WORKGROUP })
  );

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
    new StartQueryExecutionCommand({
      QueryString: `MSCK REPAIR TABLE ${ATHENA_TABLE_NAME}`,
      WorkGroup: ATHENA_WORKGROUP,
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

const getCondition = (year: string, month: string, day?: string) => {
  if (day === undefined) {
    return `timestamp like '${year}/${month}/%'`;
  }

  return `timestamp = '${year}/${month}/${day}'`;
};
