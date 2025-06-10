import { handleActions, Action } from 'redux-actions';
import { Resources } from '@domains';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const resources = handleActions<Resources, any>(
  {
    /** get resource list */
    [ActionTypes.RES_GET_LIST_SUCCESS]: (state: Resources, { payload }: Action<Actions.GetResourcesPayload>) =>
      state.setResources(payload),
  },

  new Resources()
);

export default resources;
