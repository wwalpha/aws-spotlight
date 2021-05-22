import Axios from 'axios';

Axios.defaults.baseURL = 'Environments.API_BASE_URL';

export const get = async (path: string, headers?: any) =>
  await Axios.get(path, {
    headers,
  });

export const put = async (path: string, body?: any) =>
  await Axios.put(path, {
    body,
  });

export const post = async (path: string, body?: any) => await Axios.post(path, body);
