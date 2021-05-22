import { ReduxAction0, ReduxAction1 } from './types';

/** sidemenu payload */
export interface SidemenuPayload {
  open: boolean;
}

/** sidemenu action */
export type SidemenuAction = ReduxAction1<boolean, SidemenuPayload>;
