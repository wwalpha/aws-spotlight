export * from '../../typings/index';
import { Tables } from '../../typings/tables';

export type EVENT_TYPE = Record<string, Tables.TEventType>;
export type EVENT_UNPROCESSED = Record<string, Tables.TUnprocessed[]>;

export interface ResourceInfo {
  id: string;
  name?: string;
}
