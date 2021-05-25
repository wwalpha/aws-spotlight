import { ReduxAction0, ReduxAction1 } from './types';
import { Resource } from '.';

/** sidemenu payload */
export interface SidemenuPayload {
  open: boolean;
}

/** sidemenu action */
export type SidemenuAction = ReduxAction1<boolean, SidemenuPayload>;

/** settitle payload */
export interface TitlePayload {
  title: string;
}

/** settitle action */
export type SetTitleAction = ReduxAction1<title, TitlePayload>;

/** sidemenu payload */
export type GetResourcesPayload = Resource.GetResourceResponse;

/** sidemenu action */
export type GetResourcesAction = ReduxAction1<string, GetResourcesPayload>;
