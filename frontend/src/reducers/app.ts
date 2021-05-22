import { handleActions, Action } from 'redux-actions';
import { App } from '@domains';
import { ActionTypes } from '@constants';
import { SidemenuPayload } from 'typings/actions';

const app = handleActions<App, any>(
  {
    [ActionTypes.APP_SIDEMENU_SUCCESS]: (state: App, { payload: { open } }: Action<SidemenuPayload>) =>
      state.sidemenu(open),
  },

  new App()
);

export default app;
