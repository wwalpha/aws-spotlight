import { cloudtrail } from '@src/index';
import { S3Event } from 'aws-lambda';

const start = async () => {
  await monthly(2021, '06');
  // await monthly(2021, '07');
  // await monthly(2021, '08');
  // await monthly(2021, '09');
  // await monthly(2021, '10');
  // await monthly(2021, '11');
  // await monthly(2021, '12');
  // await monthly(2022, '01');
  // await monthly(2022, '02');
  // await monthly(2022, '03');
  // await monthly(2022, '04');
  // await monthly(2022, '05');
  // await monthly(2022, '06');
  // await monthly(2022, '07');
  // await monthly(2022, '08');
  // await monthly(2022, '09');
  // await monthly(2022, '10');
  // await monthly(2022, '11');
  // await monthly(2022, '12');
  // await monthly(2023, '01');
  // await monthly(2023, '02');
  // await monthly(2023, '03');
  // await monthly(2023, '04');
  // await monthly(2023, '05');
  // await monthly(2023, '06');
  // await monthly(2023, '07');
  // await monthly(2023, '08');
  // await monthly(2023, '09');
  // await monthly(2023, '10');
  // await monthly(2023, '11');
  // await monthly(2023, '12');
  // await monthly(2024, '01');
  // await monthly(2024, '02');
  // await monthly(2024, '03');
  // await monthly(2024, '04');
  // await monthly(2024, '05');
  // await monthly(2024, '06');
  // await monthly(2024, '07');
  // await monthly(2024, '08');
  // await monthly(2024, '09');
  // await monthly(2024, '10');
  // await monthly(2024, '11');
};

const monthly = async (year: number, month: string) => {
  await cloudtrail(getInput(year, month, '01') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '02') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '03') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '04') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '05') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '06') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '07') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '08') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '09') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '10') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '11') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '12') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '13') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '14') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '15') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '16') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '17') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '18') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '19') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '20') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '21') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '22') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '23') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '24') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '25') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '26') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '27') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '28') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '29') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '30') as S3Event, undefined as any, undefined as any);
  await cloudtrail(getInput(year, month, '31') as S3Event, undefined as any, undefined as any);
};

const getInput = (year: number, month: string, day: string) => ({
  Records: [
    {
      s3: {
        bucket: { name: 'spotlight-material-us-east-1-dev' },
        object: { key: `CloudTrail/year=${year}/month=${month}/${year}${month}${day}.csv` },
      },
    },
  ],
});

start();
