export namespace Auth {
  /** User Login Request */
  interface UserLoginRequest {
    username: string;
    password: string;
    mfaCode?: string;
    newPassword?: string;
  }

  /** User Login Response */
  interface UserLoginResponse extends AuthenticateFailure {
    token?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface UserPoolInfo {
    clientId: string;
    userPoolId: string;
  }

  interface AuthenticateFailure {
    newPasswordRequired?: boolean;
    mfaRequired?: boolean;
  }
}
