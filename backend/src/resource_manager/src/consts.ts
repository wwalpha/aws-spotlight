export const ROLE = {
  ADMIN: 'TENANT_ADMIN',
  USER: 'TENANT_USER',
};

export const TABLE_NAME_RESOURCE = process.env.TABLE_NAME_RESOURCE as string;
export const TABLE_NAME_SETTINGS = process.env.TABLE_NAME_SETTINGS as string;
export const SNS_TOPIC_ARN_ADMIN = process.env.SNS_TOPIC_ARN_ADMIN as string;
