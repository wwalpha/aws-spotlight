import { cloudtrail } from '@src/index';
import { S3Event } from 'aws-lambda';

const start = async () => {
  await cloudtrail(getInput(2021, '06') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2021, '07') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2021, '08') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2021, '09') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2021, '10') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2021, '11') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2021, '12') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2022, '01') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2022, '02') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2022, '03') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2022, '04') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2022, '05') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2022, '06') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2022, '07') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2022, '08') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2022, '09') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2022, '10') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2022, '11') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2022, '12') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2023, '01') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2023, '02') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2023, '03') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2023, '04') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2023, '05') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2023, '06') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2023, '07') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2023, '08') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2023, '09') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2023, '10') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2023, '11') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2023, '12') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2024, '01') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2024, '02') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2024, '03') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2024, '04') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2024, '05') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2024, '06') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2024, '07') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2024, '08') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2024, '09') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2024, '10') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(2024, '11') as S3Event, undefined as any, undefined as any);
};

const getInput = (year: number, month: string) => ({
  Records: [
    {
      s3: {
        bucket: { name: 'spotlight-material-us-east-1-dev' },
        object: { key: `CloudTrail/year=${year}/month=${month}/${year}${month}.csv` },
      },
    },
  ],
});

start();
