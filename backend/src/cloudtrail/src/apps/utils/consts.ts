export const Environments = {
  TABLE_NAME_EVENT_TYPE: process.env.TABLE_NAME_EVENT_TYPE as string,
  TABLE_NAME_EVENTS: process.env.TABLE_NAME_EVENTS as string,
  TABLE_NAME_RESOURCES: process.env.TABLE_NAME_RESOURCES as string,
  TABLE_NAME_RAW: process.env.TABLE_NAME_RAW as string,
  TABLE_NAME_ERRORS: process.env.TABLE_NAME_ERRORS as string,
  TABLE_NAME_HISTORY: process.env.TABLE_NAME_HISTORY as string,
  TABLE_NAME_UNPROCESSED: process.env.TABLE_NAME_UNPROCESSED as string,
  TABLE_NAME_IGNORES: process.env.TABLE_NAME_IGNORES as string,
  SNS_TOPIC_ARN: process.env.SNS_TOPIC_ARN as string,
};

export const ResourceStatus = {
  CREATED: 'Created',
  DELETED: 'Deleted',
};

export const EVENT_SOURCE = {
  EC2: 'ec2.amazonaws.com',
  CLOUDFORMATION: 'cloudformation.amazonaws.com',
};

export const SERVICE_EVENT = {};
