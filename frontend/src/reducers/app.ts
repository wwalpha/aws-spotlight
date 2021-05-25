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
    /** sidemenu */
    [ActionTypes.APP_SIDEMENU_SUCCESS]: (state: App, { payload: { open } }: Action<Actions.SidemenuPayload>) =>
      state.sidemenu(open),
    /** change app tile */
    [ActionTypes.APP_TITLE_SUCCESS]: (state: App, { payload: { title } }: Action<Actions.TitlePayload>) =>
      state.setTitle(title),
  },

  new App()
);

export default app;
