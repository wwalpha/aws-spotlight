import { SQSRecord } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import { CloudTrail, EVENT_TYPE } from 'typings';

const sqsClient = new SQS();
const SQS_URL = process.env.SQS_URL as string;

/**
 * Receive SQS Messages
 *
 * @returns
 */
export const getSQSMessages = async () => {
  const sqsResults = await sqsClient
    .receiveMessage({
      QueueUrl: SQS_URL,
      MaxNumberOfMessages: 10,
    })
    .promise();

  return (sqsResults.Messages ??= []);
};

/**
 * delete sqs message
 *
 * @param message
 */
export const deleteMessage = async (message: SQSRecord) => {
  await sqsClient
    .deleteMessage({
      QueueUrl: SQS_URL,
      ReceiptHandle: message.receiptHandle,
    })
    .promise();
};

/**
 * remove ReadOnly=true records
 *
 * @param records
 * @returns
 */
export const removeReadOnly = (records: CloudTrail.Record[]) => records.filter((item) => !(item.readOnly === true));

/**
 * remove error message record
 *
 * @param records
 * @returns
 */
export const removeError = (records: CloudTrail.Record[]) => records.filter((item) => !(item.errorCode !== undefined));

/**
 * remove ignore message record
 *
 * @param records
 * @returns
 */
export const removeIgnore = (records: CloudTrail.Record[], events: EVENT_TYPE) =>
  records.filter((item) => {
    const event = events[item.eventName];

    if (event === undefined) {
      return true;
    }

    if (event.EventSource === item.eventSource) {
      return !(event.Ignore === true);
    }

    return true;
  });
