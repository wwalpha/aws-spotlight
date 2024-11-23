import { createAction } from 'redux-actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const success = createAction<Actions.TitlePayload, string>(ActionTypes.APP_TITLE_SUCCESS, (title) => ({
  title,
}));

/** グループ選択 */
export const title: Actions.SetTitleAction = (title: string) => async (dispatch) => {
  dispatch(success(title));
};
