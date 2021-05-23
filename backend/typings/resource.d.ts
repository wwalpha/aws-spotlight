import * as Tables from './tables';

/** get service resouce parameter */
export interface GetResourceParameter {
  service: string;
}
/** get service resouce request */
export interface GetResourceRequest {}
/** get service resouce response */
export interface GetResourceResponse {
  items: Tables.Resource[];
}
