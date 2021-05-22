import { createAction } from 'redux-actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';
import { defaultFailure } from '..';

const success = createAction<Actions.SidemenuPayload, boolean>(ActionTypes.APP_SIDEMENU_SUCCESS, (open) => ({
  open,
}));

/** グループ選択 */
export const sidemenu: Actions.SidemenuAction = (open: boolean) => async (dispatch) => {
  try {
    dispatch(success(open));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};
