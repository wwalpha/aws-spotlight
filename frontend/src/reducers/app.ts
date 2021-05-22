import { handleActions, Action } from 'redux-actions';
import { App } from '@domains';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const app = handleActions<App, any>(
  {
    [ActionTypes.APP_SIDEMENU_SUCCESS]: (state: App, { payload: { open } }: Action<Actions.SidemenuPayload>) =>
      state.sidemenu(open),

    [ActionTypes.APP_TITLE_SUCCESS]: (state: App, { payload: { title } }: Action<Actions.TitlePayload>) =>
      state.setTitle(title),
  },

  new App()
);

export default app;
