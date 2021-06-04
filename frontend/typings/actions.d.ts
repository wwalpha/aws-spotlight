import { ReduxAction0, ReduxAction1, ReduxAction2 } from './types';
import { Resource } from '.';
import { APIs } from './api';
import { Auth } from '../../backend/typings/auth';

// ***************************************************************************************
// App Actions
// ***************************************************************************************
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
export type SetTitleAction = ReduxAction1<string, TitlePayload>;

/** login payload */
export type SignInPayload = {
  username: string;
  response: Auth.SignInResponse;
};

/** login action */
export type SignInAction = ReduxAction3<string, string, string, SignInPayload>;

/** sidemenu payload */
export type GetResourcesPayload = {
  eventSource: string;
  response: Resource.GetResourceResponse;
};

/** sidemenu action */
export type GetResourcesAction = ReduxAction1<string, GetResourcesPayload>;
