// Environment variables
export const Environments = {
  TABLE_NAME_USER: process.env.TABLE_NAME_USER as string,
  SERVICE_ENDPOINT_USER: process.env.SERVICE_ENDPOINT_USER as string,
};

export const Endpoints = {
  USER: (user:string) => `${Environments.SERVICE_ENDPOINT_USER}/user/${user}`,
};
