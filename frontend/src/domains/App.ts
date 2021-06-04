import { immerable, produce } from 'immer';
import { Auth } from 'typings';

export default class App {
  [immerable] = true;

  open: boolean = false;
  // loading status
  isLoading: boolean = false;
  // screen title
  title: string = 'AWS RESOURCE MANAGEMENT SYSTEM';
  // token
  authorizationToken?: string;
  // username
  userName?: string;
  // mfa required flag
  mfaRequired?: boolean;
  // new password required flag
  newPasswordRequired?: boolean;

  /** sidemenu show/hide */
  sidemenu(open: boolean) {
    return produce(this, (draft) => {
      draft.open = open;
    });
  }

  setTitle(title: string) {
    return produce(this, (draft) => {
      draft.title = title;
    });
  }

  signIn(username: string, response: Auth.SignInResponse) {
    return produce(this, (draft) => {
      draft.mfaRequired = response.mfaRequired;
      draft.newPasswordRequired = response.newPasswordRequired;
      draft.userName = username;

      if (response.token && response.accessToken && response.refreshToken) {
        draft.authorizationToken = response.token;
        window.sessionStorage.setItem('token', response.token);
        window.sessionStorage.setItem('accessToken', response.accessToken);
        window.sessionStorage.setItem('refreshToken', response.refreshToken);
      }
    });
  }

  setLoading(isLoading: boolean) {
    return produce(this, (draft) => {
      draft.isLoading = isLoading;
    });
  }
}
