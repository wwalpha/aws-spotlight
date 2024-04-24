import { handler } from '../src/index';

const debug = async () => {
  await handler(
    {
      Records: [
        {
          awsRegion: 'us-east-1',
          dynamodb: {
            ApproximateCreationDateTime: 1713916329,
            Keys: {
              EventTime: { S: '2023-03-09T09:09:13Z' },
              ResourceId: { S: 'arn:aws:apigateway:us-east-1::/domainnames/api.arms.oneclouddemo.com' },
            },
            SequenceNumber: '5896800000000035157768437',
            SizeBytes: 107,
            StreamViewType: 'KEYS_ONLY',
          },
          eventID: '5e7345b9d6bd285b8b5553b0e77b802a',
          eventName: 'REMOVE',
          eventSource: 'aws:dynamodb',
          eventSourceARN:
            'arn:aws:dynamodb:us-east-1:334678299258:table/arms-resources-8cd531/stream/2024-04-23T13:17:19.186',
          eventVersion: '1.1',
        },
        {
          awsRegion: 'us-east-1',
          dynamodb: {
            ApproximateCreationDateTime: 1713916329,
            Keys: {
              EventTime: { S: '2023-07-10T09:32:51Z' },
              ResourceId: { S: 'arn:aws:ec2:ap-northeast-1:334678299258:instance/i-05641142330c696e7' },
            },
            SequenceNumber: '5896900000000035157768438',
            SizeBytes: 107,
            StreamViewType: 'KEYS_ONLY',
          },
          eventID: '73b05e4bb70303584fc8d6339c42028e',
          eventName: 'REMOVE',
          eventSource: 'aws:dynamodb',
          eventSourceARN:
            'arn:aws:dynamodb:us-east-1:334678299258:table/arms-resources-8cd531/stream/2024-04-23T13:17:19.186',
          eventVersion: '1.1',
        },
        {
          awsRegion: 'us-east-1',
          dynamodb: {
            ApproximateCreationDateTime: 1713916329,
            Keys: {
              EventTime: { S: '2024-02-22T07:28:51Z' },
              ResourceId: { S: 'arn:aws:ec2:ap-northeast-1::snapshot/snap-0283b010fcf0c22fa' },
            },
            SequenceNumber: '5897000000000035157768439',
            SizeBytes: 98,
            StreamViewType: 'KEYS_ONLY',
          },
          eventID: 'bc96cfe63021a99d1f73e3c7ee44ed4a',
          eventName: 'REMOVE',
          eventSource: 'aws:dynamodb',
          eventSourceARN:
            'arn:aws:dynamodb:us-east-1:334678299258:table/arms-resources-8cd531/stream/2024-04-23T13:17:19.186',
          eventVersion: '1.1',
        },
        {
          awsRegion: 'us-east-1',
          dynamodb: {
            ApproximateCreationDateTime: 1713916329,
            Keys: {
              EventTime: { S: '2024-03-04T07:32:03Z' },
              ResourceId: { S: 'arn:aws:ec2:ap-northeast-1::snapshot/snap-0d43f471b64e7d9f1' },
            },
            SequenceNumber: '5897100000000035157768440',
            SizeBytes: 98,
            StreamViewType: 'KEYS_ONLY',
          },
          eventID: 'b940990f6e5b70d5489f6b9ea1297f2c',
          eventName: 'REMOVE',
          eventSource: 'aws:dynamodb',
          eventSourceARN:
            'arn:aws:dynamodb:us-east-1:334678299258:table/arms-resources-8cd531/stream/2024-04-23T13:17:19.186',
          eventVersion: '1.1',
        },
        {
          awsRegion: 'us-east-1',
          dynamodb: {
            ApproximateCreationDateTime: 1713916329,
            Keys: {
              EventTime: { S: '2022-07-27T04:59:40Z' },
              ResourceId: {
                S: 'arn:aws:elasticloadbalancing:ap-northeast-1:334678299258:targetgroup/awseb-AWSEB-5K31RQTQOQ5G/e8376bbcfdd8ba3c',
              },
            },
            SequenceNumber: '5897200000000035157768441',
            SizeBytes: 149,
            StreamViewType: 'KEYS_ONLY',
          },
          eventID: 'a4a557eb859094762f4a21c71e2b1cda',
          eventName: 'REMOVE',
          eventSource: 'aws:dynamodb',
          eventSourceARN:
            'arn:aws:dynamodb:us-east-1:334678299258:table/arms-resources-8cd531/stream/2024-04-23T13:17:19.186',
          eventVersion: '1.1',
        },
        {
          awsRegion: 'us-east-1',
          dynamodb: {
            ApproximateCreationDateTime: 1713916329,
            Keys: {
              EventTime: { S: '2022-07-04T03:35:19Z' },
              ResourceId: { S: 'arn:aws:ec2:ap-northeast-1:334678299258:instance/i-059b03c9d72c60be1' },
            },
            SequenceNumber: '5897300000000035157768442',
            SizeBytes: 107,
            StreamViewType: 'KEYS_ONLY',
          },
          eventID: '19323329dd9bc6dbada69eaf62bb04b3',
          eventName: 'REMOVE',
          eventSource: 'aws:dynamodb',
          eventSourceARN:
            'arn:aws:dynamodb:us-east-1:334678299258:table/arms-resources-8cd531/stream/2024-04-23T13:17:19.186',
          eventVersion: '1.1',
        },
        {
          awsRegion: 'us-east-1',
          dynamodb: {
            ApproximateCreationDateTime: 1713916329,
            Keys: {
              EventTime: { S: '2023-09-19T05:37:33Z' },
              ResourceId: {
                S: 'arn:aws:lambda:ap-northeast-1:334678299258:function:arn:aws:lambda:ap-northeast-1:334678299258:function:amplify-login-define-auth-challenge-cded3d10',
              },
            },
            SequenceNumber: '5897400000000035157768443',
            SizeBytes: 187,
            StreamViewType: 'KEYS_ONLY',
          },
          eventID: '3e48ec7defb78e73f9f74132c0239bc6',
          eventName: 'REMOVE',
          eventSource: 'aws:dynamodb',
          eventSourceARN:
            'arn:aws:dynamodb:us-east-1:334678299258:table/arms-resources-8cd531/stream/2024-04-23T13:17:19.186',
          eventVersion: '1.1',
        },
        {
          awsRegion: 'us-east-1',
          dynamodb: {
            ApproximateCreationDateTime: 1713916329,
            Keys: {
              EventTime: { S: '2024-02-18T02:39:34Z' },
              ResourceId: { S: 'arn:aws:ec2:ap-northeast-1:334678299258:subnet/subnet-0a12ded118295dd0d' },
            },
            SequenceNumber: '5897500000000035157768444',
            SizeBytes: 110,
            StreamViewType: 'KEYS_ONLY',
          },
          eventID: '65d0c6c9c2dc1a57c2eeaf89d2a62334',
          eventName: 'REMOVE',
          eventSource: 'aws:dynamodb',
          eventSourceARN:
            'arn:aws:dynamodb:us-east-1:334678299258:table/arms-resources-8cd531/stream/2024-04-23T13:17:19.186',
          eventVersion: '1.1',
        },
        {
          awsRegion: 'us-east-1',
          dynamodb: {
            ApproximateCreationDateTime: 1713916329,
            Keys: {
              EventTime: { S: '2023-12-19T04:02:12Z' },
              ResourceId: {
                S: 'arn:aws:cloudformation:ap-northeast-1:334678299258:stack/ECS-Console-V2-Service-github-runner2-github-runner-5b4bbe31',
              },
            },
            SequenceNumber: '5897600000000035157768446',
            SizeBytes: 156,
            StreamViewType: 'KEYS_ONLY',
          },
          eventID: '2a7bf7c9bfd12843839f51e194d1b996',
          eventName: 'REMOVE',
          eventSource: 'aws:dynamodb',
          eventSourceARN:
            'arn:aws:dynamodb:us-east-1:334678299258:table/arms-resources-8cd531/stream/2024-04-23T13:17:19.186',
          eventVersion: '1.1',
        },
        {
          awsRegion: 'us-east-1',
          dynamodb: {
            ApproximateCreationDateTime: 1713916329,
            Keys: {
              EventTime: { S: '2023-12-14T08:36:06Z' },
              ResourceId: {
                S: 'arn:aws:cloudformation:ap-northeast-1:334678299258:stack/ECS-Console-V2-Service-github-runner2-github-runner-5b4bbe31',
              },
            },
            SequenceNumber: '5897700000000035157768447',
            SizeBytes: 156,
            StreamViewType: 'KEYS_ONLY',
          },
          eventID: '0c323a77b0cc3fb41d3279e0b7fac788',
          eventName: 'REMOVE',
          eventSource: 'aws:dynamodb',
          eventSourceARN:
            'arn:aws:dynamodb:us-east-1:334678299258:table/arms-resources-8cd531/stream/2024-04-23T13:17:19.186',
          eventVersion: '1.1',
        },
      ],
    },
    null as any,
    () => {}
  );
};

debug();
