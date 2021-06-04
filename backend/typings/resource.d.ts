import * as Tables from './tables';

export namespace Resource {
  /** get service resouce parameter */
  interface GetResourceParameter {
    service: string;
  }
  /** get service resouce request */
  interface GetResourceRequest {}
  /** get service resouce response */
  interface GetResourceResponse {
    items: Tables.Resource[];
  }
}
