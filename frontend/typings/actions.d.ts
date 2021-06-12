import { ReduxAction0, ReduxAction1, ReduxAction2, ReduxAction3, ReduxActionAny } from './types';
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

/** signin payload */
export type SignInPayload = {
  username: string;
  response: Auth.SignInResponse;
};

/** signin action */
export type SignInAction = ReduxActionAny<SignInPayload>;

/** get resource payload */
export type GetResourcesPayload = {
  eventSource: string;
  response: Resource.GetResourceResponse;
};

/** get resource action */
export type GetResourcesAction = ReduxAction1<string, GetResourcesPayload>;

/** categories payload */
export type GetCategoriesPayload = {
  categories: string[];
};

/** signin action */
export type GetCategoriesAction = ReduxAction0<GetCategoriesPayload>;
