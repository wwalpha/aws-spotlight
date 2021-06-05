import { createAction } from 'redux-actions';
import { ActionTypes } from '@constants';
import { endLoading, startLoading } from '@actions';
import { Actions, Auth } from 'typings';
import { Consts } from '@constants';

const success = createAction<Actions.SignInPayload, string, Auth.SignInResponse>(
  ActionTypes.APP_LOGIN_SUCCESS,
  (username, response) => ({
    username,
    response,
  })
);

/** ログイン */
export const signIn: Actions.SignInAction =
  (userName: string, passwd: string, newpasswd?: string) => async (dispatch, _, api) => {
    dispatch(startLoading());

    try {
      const res = await api.post<Auth.SignInResponse>(Consts.API_URLs.SignIn, {
        username: userName,
        password: passwd,
        newPassword: newpasswd,
      } as Auth.SignInRequest);

      dispatch(success(userName, res));
    } catch (err) {
      dispatch(endLoading());
    } finally {
      dispatch(endLoading());
    }
  };
