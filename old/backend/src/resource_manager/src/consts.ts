export const ROLE = {
  ADMIN: 'TENANT_ADMIN',
  USER: 'TENANT_USER',
};

export const Environments = {
  ENDPOINT_USER_SERVICE: process.env.ENDPOINT_USER_SERVICE as string,
  TABLE_NAME_SETTINGS: process.env.TABLE_NAME_SETTINGS as string,
  TABLE_NAME_RESOURCES: process.env.TABLE_NAME_RESOURCES as string,
  TABLE_NAME_ERRORS: process.env.TABLE_NAME_ERRORS as string,
  TABLE_NAME_UNPROCESSED: process.env.TABLE_NAME_UNPROCESSED as string,
  TABLE_NAME_IGNORES: process.env.TABLE_NAME_IGNORES as string,
  TABLE_NAME_EVENT_TYPE: process.env.TABLE_NAME_EVENT_TYPE as string,
  SNS_TOPIC_ARN_ADMIN: process.env.SNS_TOPIC_ARN_ADMIN as string,
  S3_BUCKET_ARCHIVE: process.env.S3_BUCKET_ARCHIVE as string,
};

export const API_URLs = {
  ListAdminUsers: `${Environments.ENDPOINT_USER_SERVICE}/users/admins`,
};
