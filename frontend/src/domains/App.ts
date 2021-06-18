import { immerable, produce } from 'immer';
import { Actions, Auth, Tables } from 'typings';

export default class App {
  [immerable] = true;

  open: boolean = false;
  // initialize flag
  initialized: boolean = false;
  // loading status
  isLoading: boolean = false;
  // screen title
  title: string = 'AWS RESOURCE MANAGEMENT SYSTEM';
  // version
  version?: string;
  // token
  authorizationToken?: string | null = window.sessionStorage.getItem('token');
  // username
  userName?: string;
  // mfa required flag
  mfaRequired?: boolean;
  // new password required flag
  newPasswordRequired?: boolean;
  // category list
  categories?: string[] = [];
  // release notes
  releaseNotes?: Tables.Settings.Release[] = [];

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

  initialize(payload: Actions.InitializePayload) {
    return produce(this, (draft) => {
      draft.categories = payload.categories?.categories;
      draft.releaseNotes = payload.releaseNotes?.infos;
      draft.version = payload.version?.version;
      draft.initialized = true;
    });
  }

  setLoading(isLoading: boolean) {
    return produce(this, (draft) => {
      draft.isLoading = isLoading;
    });
  }
}
