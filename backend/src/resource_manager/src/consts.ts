export const ROLE = {
  ADMIN: 'TENANT_ADMIN',
  USER: 'TENANT_USER',
};

export const Environments = {
  ENDPOINT_USER_SERVICE: process.env.ENDPOINT_USER_SERVICE as string,
  TABLE_NAME_SETTINGS: process.env.TABLE_NAME_SETTINGS as string,
  TABLE_NAME_RESOURCE: process.env.TABLE_NAME_RESOURCE as string,
  SNS_TOPIC_ARN_ADMIN: process.env.SNS_TOPIC_ARN_ADMIN as string,
};

export const API_URLs = {
  ListAdminUsers: `${Environments.ENDPOINT_USER_SERVICE}/users/admins`,
};
