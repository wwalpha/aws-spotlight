import { AthenaClient, GetQueryExecutionCommand, StartQueryExecutionCommand } from '@aws-sdk/client-athena';

const client = new AthenaClient();
const WORK_GROUP = process.env.WORK_GROUP as string;

export const handler = async () => {
  const queryCommand = new StartQueryExecutionCommand({
    QueryString: 'SELECT * FROM my_table',
    WorkGroup: WORK_GROUP,
    QueryExecutionContext: {
      Database: 'default',
    },
  });

  // Start the query
  const queryRes = await client.send(queryCommand);

  // Wait for the query to complete
  await waitExecutionComplete(queryRes.QueryExecutionId);
};

const waitExecutionComplete = async (queryExecutionId?: string) => {
  if (!queryExecutionId) {
    return;
  }

  const command = new GetQueryExecutionCommand({
    QueryExecutionId: queryExecutionId,
  });

  const res = await client.send(command);

  // If the query failed, throw an error
  if (res.QueryExecution?.Status?.State === 'FAILED') {
    throw new Error('Query failed');
  }

  // If the query is still running, wait for 30 seconds before checking again
  if (res.QueryExecution?.Status?.State !== 'SUCCEEDED') {
    // wait for 30 seconds before checking again
    await sleep(30000);

    await waitExecutionComplete(queryExecutionId);
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
