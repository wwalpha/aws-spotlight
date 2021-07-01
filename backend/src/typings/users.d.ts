export namespace User {
  interface CognitoInfos {
    UserPoolId?: string;
    ClientId?: string;
    IdentityPoolId?: string;
  }

  interface TenantUser {
    /** user id */
    userId: string;
    /** username */
    userName: string;
    /** email */
    email: string;
  }

  interface GetUserResquest {}

  interface GetUserResponse {
    userId: string;
    userName: string;
    role: string;
  }

  interface CreateAdminRequest extends TenantUser {}

  interface CreateAdminResponse {
    /** user id */
    userId: string;
    /** user name */
    userName: string;
    /** email */
    email: string;
  }

  interface LookupUserRequest {}

  interface LookupUserResponse {
    /** is user exist */
    isExist: boolean;
    /** user pool id */
    userPoolId?: string;
    /** user pool client id */
    clientId?: string;
    /** identity pool id */
    identityPoolId?: string;
  }

  interface CreateUserRequest extends TenantUser {}

  interface CreateUserResponse {
    userId: string;
  }

  interface ListAdminUsersRequest {}

  interface ListAdminUsersResponse {
    users: string[];
  }
}
