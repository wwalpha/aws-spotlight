export const Environments = {
  USER_SERVICE_ENDPOINT: process.env.USER_SERVICE_ENDPOINT as string,
};

export const API_URLs = {
  GetUser: (username: string) => `${Environments.USER_SERVICE_ENDPOINT}/pool/${username}`,
};
