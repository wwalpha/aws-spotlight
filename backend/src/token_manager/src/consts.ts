// Environment variables
export const Environments = {
  TABLE_NAME_USER: process.env.TABLE_NAME_USER as string,
  ENDPOINT_USER_SERVICE: process.env.ENDPOINT_USER_SERVICE as string,
};

export const Endpoints = {
  USER: (user: string) => `${Environments.ENDPOINT_USER_SERVICE}/user/${user}`,
};
