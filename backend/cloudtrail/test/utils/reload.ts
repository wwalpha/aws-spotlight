import { DynamodbHelper } from '@alphax/dynamodb';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { getEvents, getIgnore } from '@test/initialize';
import { start as patch } from '@test/patch';
import { S3Event } from 'aws-lambda';

const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;
const TABLE_NAME_EVENT_TYPE = process.env.TABLE_NAME_EVENT_TYPE as string;
const BUCKCT_NAME = process.env.BUCKET_NAME as string;

const start = async () => {
  const helper = new DynamodbHelper();

  for (;;) {
    try {
      await helper.truncateAll(TABLE_NAME_RESOURCES);
      break;
    } catch (e) {}
  }

  await helper.truncateAll(TABLE_NAME_EVENT_TYPE);
  const Events = [...getEvents(), ...getIgnore()];
  await helper.bulk(TABLE_NAME_EVENT_TYPE, Events);

  await patch();

  // Lambda 関数を呼び出す例
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2021, '06') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2021, '07') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2021, '08') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2021, '09') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2021, '10') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2021, '11') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2021, '12') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2022, '01') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2022, '02') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2022, '03') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2022, '04') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2022, '05') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2022, '06') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2022, '07') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2022, '08') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2022, '09') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2022, '10') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2022, '11') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2022, '12') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2023, '01') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2023, '02') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2023, '03') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2023, '04') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2023, '05') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2023, '06') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2023, '07') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2023, '08') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2023, '09') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2023, '10') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2023, '11') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2023, '12') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2024, '01') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2024, '02') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2024, '03') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2024, '04') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2024, '05') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2024, '06') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2024, '07') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2024, '08') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2024, '09') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2024, '10') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2024, '11') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2024, '12') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '01') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '02') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '03') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '01') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '02') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '03') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '04') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '05') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '06') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '07') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '08') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '09') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '10') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '11') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '12') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '13') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '14') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '15') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '16') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '17') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '18') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '19') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '20') as S3Event);
  await invokeLambda('spotlight-cloudtrail-process-prod', getInput(2025, '04', '21') as S3Event);
};

const invokeLambda = async (functionName: string, payload: object) => {
  const client = new LambdaClient(); // リージョンを指定
  const command = new InvokeCommand({
    FunctionName: functionName,
    Payload: Buffer.from(JSON.stringify(payload)),
  });

  try {
    await client.send(command);
  } catch (error) {
    console.error('Error invoking Lambda:', error);
    throw error;
  }
};

const getInput = (year: number, month: string, day?: string) => {
  console.log(year, month, day);
  return {
    Records: [
      {
        s3: {
          bucket: { name: BUCKCT_NAME },
          object: {
            key:
              day !== undefined
                ? `CloudTrail/year=${year}/month=${month}/${year}${month}${day}.csv`
                : `CloudTrail/year=${year}/month=${month}/${year}${month}.csv`,
          },
        },
      },
    ],
  };
};

start();
