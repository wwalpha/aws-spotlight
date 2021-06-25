import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as ES from '@test/expect/es';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('es.amazonaws.com', () => {
  test('ES_CreateElasticsearchDomain', async () => {
    const event = await sendMessage(CreateEvents.ES_CreateElasticsearchDomain);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'es.amazonaws.com',
      ResourceId: 'test',
    });
    const history = await getHistory({ EventId: '1f618b2b-ed25-4c1e-9fd1-941c91160fb9' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(ES.CreateElasticsearchDomain_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(ES.CreateElasticsearchDomain_H);
  });

  test('ES_DeleteElasticsearchDomain', async () => {
    const event = await sendMessage(DeleteEvents.ES_DeleteElasticsearchDomain);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'es.amazonaws.com', ResourceId: 'test' });
    const history = await getHistory({ EventId: 'd7fb0dc4-f4aa-44c8-a5e3-b682ca114157' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(ES.DeleteElasticsearchDomain_H);
  });
});
