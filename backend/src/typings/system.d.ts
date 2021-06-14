import { Tables } from 'typings';

export namespace System {
  // get version no request
  interface VersionRequest {}

  // get version no response
  interface VersionResponse {
    version: string;
  }

  // get release information request
  interface ReleaseRequest {}

  // get release information response
  interface ReleaseReseponse {
    infos: Tables.Settings.Release[];
  }
}
