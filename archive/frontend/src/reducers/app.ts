import { handleActions, Action } from 'redux-actions';
import { App } from '@domains';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const app = handleActions<App, any>(
  {
    /** start loading */
    [ActionTypes.COM_01_SUCCESS]: (state: App) => state.setLoading(true),
    /** end loading */
    [ActionTypes.COM_01_FAILURE]: (state: App) => state.setLoading(false),
    /** end loading */
    [ActionTypes.COM_02_SUCCESS]: (state: App) => state.setLoading(false),
    /** sign in */
    [ActionTypes.APP_LOGIN_SUCCESS]: (state: App, { payload: { username, response } }: Action<Actions.SignInPayload>) =>
      state.signIn(username, response),
    /** sidemenu */
    [ActionTypes.APP_SIDEMENU_SUCCESS]: (state: App, { payload: { open } }: Action<Actions.SidemenuPayload>) =>
      state.sidemenu(open),
    /** change app tile */
    [ActionTypes.APP_TITLE_SUCCESS]: (state: App, { payload: { title } }: Action<Actions.TitlePayload>) =>
      state.setTitle(title),
    /** initialize */
    [ActionTypes.APP_INITIALIZE_SUCCESS]: (state: App, { payload }: Action<Actions.InitializePayload>) =>
      state.initialize(payload),
  },

  new App()
);

export default app;
