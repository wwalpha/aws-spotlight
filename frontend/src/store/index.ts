import axios from 'axios';
import { Consts, Environments } from '@constants';
import { Credentials as CredentialManager } from '@utils';
import { Auth } from 'typings';

export const Credentials = new CredentialManager('arms');

Credentials.refreshSession = async (accessToken: string | null, refreshToken: string | null) => {
  if (!refreshToken) return;

  const res = await axios.post<Auth.InitiateAuthResponse>(
    `${Environments.BACKEND_API_URL}${Consts.API_URLs.InitiateAuth}`,
    {
      accessToken,
      refreshToken,
    } as Auth.InitiateAuthRequest
  );

  // error check
  if (!res.data.idToken || !res.data.accessToken || !res.data.refreshToken) {
    throw new Error('Refresh tokens failed.');
  }

  return {
    idToken: res.data.idToken,
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
  };
};

const store = () => {
  if (process.env.NODE_ENV !== 'production') {
    return require('./dev').default;
  }

  return require('./prod').default;
};

export default store;

export const history = process.env.NODE_ENV !== 'production' ? require('./dev').history : require('./prod').history;
