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
    // initialize flag
    initialized: boolean;
    // screen title
    title: string;
    // version
    version?: string;
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
    // category list
    categories?: string[];
    // release notes
    releaseNotes?: Tables.Settings.Release[];
  }

  /** Resources State */
  interface Resources {
    datas: Record<string, Tables.Resource[]>;
  }
}
