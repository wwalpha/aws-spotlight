export const Environments = {
  TABLE_NAME_EVENT_TYPE: process.env.TABLE_NAME_EVENT_TYPE as string,
  // TABLE_NAME_EVENTS: process.env.TABLE_NAME_EVENTS as string,
  // TABLE_NAME_RESOURCES: process.env.TABLE_NAME_RESOURCES as string,
  // TABLE_NAME_UNPROCESSED: process.env.TABLE_NAME_UNPROCESSED as string,
  SNS_TOPIC_ARN: process.env.SNS_TOPIC_ARN as string,
};

export const ResourceStatus = {
  CREATED: 'Created',
  DELETED: 'Deleted',
};

export const SERVICE_EVENT = {};
