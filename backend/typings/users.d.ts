export namespace User {
  interface GetUserResquest {}

  interface GetUserResponse {
    userid: string;
    username: string;
    type: string;
  }
}
