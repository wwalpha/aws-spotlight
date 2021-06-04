export const Environments = {
  USER_SERVICE_ENDPOINT: process.env.USER_SERVICE_ENDPOINT as string,
};

export const API_URLs = {
  LookupUser: (username: string) => `${Environments.USER_SERVICE_ENDPOINT}/user/pool/${username}`,
};
