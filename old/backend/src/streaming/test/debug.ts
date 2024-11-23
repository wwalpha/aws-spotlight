import { handler } from '../src/index';

const debug = async () => {
  await handler(
    {
      Records: [
        {
          awsRegion: 'ap-northeast-1',
          dynamodb: {
            ApproximateCreationDateTime: 1713916329,
            Keys: {
              EventTime: { S: '2021-10-13T08:38:38Z' },
              ResourceId: {
                S: 'arn:aws:cloudformation:ap-northeast-1:334678299258:stack/MCOS-SNS-CriticalWarning-email',
              },
            },
            SequenceNumber: '5897700000000035157768447',
            SizeBytes: 156,
            StreamViewType: 'KEYS_ONLY',
          },
          eventID: '0c323a77b0cc3fb41d3279e0b7fac788',
          eventName: 'INSERT',
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
