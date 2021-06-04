import { Tables } from '.';

export namespace Domains {
  /** Domain State */
  interface State {
    app: App;
    resources: Resources;
  }

  /** Application State */
  interface App {
    open: boolean;
    // screen title
    title: string;
    // loading status
    isLoading: boolean;
    // username
    userName?: string;
    // mfa required
    mfaRequired?: boolean;
    // new password required
    newPasswordRequired?: boolean;
    // jwt token
    authorizationToken?: string;
  }

  /** Resources State */
  interface Resources {
    datas: Record<string, Tables.Resource[]>;
  }
}
