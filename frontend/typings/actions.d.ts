import { ReduxAction0, ReduxAction1, ReduxAction2, ReduxAction3, ReduxActionAny } from './types';
import { Resource, System, Auth } from '.';
import { APIs } from './api';

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

/** initialize payload */
export type InitializePayload = {
  categories: Resource.GetCategoryResponse;
  releaseNotes: System.ReleaseResponse;
  version: System.VersionResponse;
};

/** signin action */
export type InitializeAction = ReduxAction0<InitializePayload>;

/** get resource payload */
export type GetResourcesPayload = {
  eventSource: string;
  response: Resource.GetResourceResponse;
};

/** get resource action */
export type GetResourcesAction = ReduxAction1<string, GetResourcesPayload>;

/** get resource payload */
export type GetReportsPayload = {};

/** get resource action */
export type GetReportsAction = ReduxAction0<GetReportsPayload>;
