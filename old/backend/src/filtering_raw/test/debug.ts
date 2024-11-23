import { handler } from '../src/index';

const debug = async () => {
  await handler(
    {
      Records: [
        {
          attributes: {
            ApproximateFirstReceiveTimestamp: '1713777280135',
            ApproximateReceiveCount: '23',
            SenderId: 'AROAU33DBSJ5DV737T25D:i-0167ec091a184a693',
            SentTimestamp: '1713777190135',
          },
          awsRegion: 'us-east-1',
          body: '{"Message":"{\\"s3Bucket\\":\\"arms-terraform-0606\\",\\"s3ObjectKey\\":[\\"cloudtrail-global/AWSLogs/999999999999/CloudTrail/us-east-1/2023/03/08/999999999999_CloudTrail_us-east-1_20230308T2335Z_I1eF06CVjjlsRqM6.json.gz\\",\\"cloudtrail-global/AWSLogs/999999999999/CloudTrail/us-east-1/2023/03/08/999999999999_CloudTrail_us-east-1_20230308T2335Z_Vxnuf9utW1mAMjJ8.json.gz\\",\\"cloudtrail-global/AWSLogs/999999999999/CloudTrail/us-east-1/2023/03/08/999999999999_CloudTrail_us-east-1_20230308T2335Z_oRpRkrDalFVJEhd2.json.gz\\",\\"cloudtrail-global/AWSLogs/999999999999/CloudTrail/us-east-1/2023/03/08/999999999999_CloudTrail_us-east-1_20230308T2340Z_CPThCVy4g9KafTpO.json.gz\\",\\"cloudtrail-global/AWSLogs/999999999999/CloudTrail/us-east-1/2023/03/08/999999999999_CloudTrail_us-east-1_20230308T2340Z_KP5tuNecIkXN1o0E.json.gz\\",\\"cloudtrail-global/AWSLogs/999999999999/CloudTrail/us-east-1/2023/03/08/999999999999_CloudTrail_us-east-1_20230308T2340Z_PlbSt4MB2G6FN72t.json.gz\\",\\"cloudtrail-global/AWSLogs/999999999999/CloudTrail/us-east-1/2023/03/08/999999999999_CloudTrail_us-east-1_20230308T2340Z_cQ85dJZC77r2KH4Z.json.gz\\",\\"cloudtrail-global/AWSLogs/999999999999/CloudTrail/us-east-1/2023/03/08/999999999999_CloudTrail_us-east-1_20230308T2340Z_fyuiIxZ2yg68SSrF.json.gz\\",\\"cloudtrail-global/AWSLogs/999999999999/CloudTrail/us-east-1/2023/03/08/999999999999_CloudTrail_us-east-1_20230308T2340Z_sP3UeFhq8J7Ezw6B.json.gz\\",\\"cloudtrail-global/AWSLogs/999999999999/CloudTrail/us-east-1/2023/03/08/999999999999_CloudTrail_us-east-1_20230308T2345Z_4pDuQNj6STZ6yqcW.json.gz\\"]}"}',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-1:999999999999:arms-filtering-raw-8cd531',
          md5OfBody: 'e7dbab5a5892d7e2ecd3be114acf989c',
          md5OfMessageAttributes: null,
          messageAttributes: {},
          messageId: 'ed3863d4-0362-4519-ae7f-e8a8cf3dd70c',
          receiptHandle:
            'AQEB5g9AxQY+nNFGwiRtGGETIBEgK6UFYUvuX+8Xqp1RSxf1ASOqbPHSoUhRcHEv/dKK/EcYgG0xcnkDyUjnyQKDB7vaPtclo0tm2ivM9EN4i+lFHxzJ6q0sfxXT4C45Ks6EvGZ65YKQ/RqLroGG3ZRZuXZrToU7023dLBSfU212e/KHH25uW+9Bu5bRZNnNv5hFmPcvjO9vCoiVmqueMxtJua9CbknIsuBBUs2JjZwVf+3Hj+/NR3zqm0K1sqN6cLcRm+ki6yJH+nE6MQ5IdAWEOIqUkqvgEYhAeP2imFEJLd5PneyCGXxVRWJz6LOBA2G+qorqBa+TXOsoCWCHraMuNBGAz05QMJ/K76yovE1pVdEeyo3xDG7rkcu/T/8GxJ/dOdqG8bd1HhtNRp6LOmh/kbdJ6v61XTqiQBayKMZQe04=',
        },
      ],
    },
    null as any,
    () => {}
  );
};

debug();
