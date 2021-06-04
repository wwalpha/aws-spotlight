export const Environments = {
  ENDPOINT_USER_SERVICE: process.env.ENDPOINT_USER_SERVICE as string,
};

export const API_URLs = {
  LookupUser: (username: string) => `${Environments.ENDPOINT_USER_SERVICE}/user/pool/${username}`,
};
