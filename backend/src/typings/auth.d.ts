export namespace Auth {
  /** User Login Request */
  interface SignInRequest {
    username: string;
    password: string;
    mfaCode?: string;
    newPassword?: string;
  }

  /** User Login Response */
  interface SignInResponse extends AuthenticateFailure {
    idToken?: string;
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

  /** Get new credentials with refresh token request */
  interface InitiateAuthRequest {
    accessToken: string;
    refreshToken: string;
  }

  /** Get new credentials with refresh token response */
  interface InitiateAuthResponse {
    idToken: string;
    accessToken: string;
  }
}
