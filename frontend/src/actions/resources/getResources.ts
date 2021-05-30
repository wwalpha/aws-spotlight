import { createAction } from 'redux-actions';
import { ActionTypes, Consts } from '@constants';
import { Actions, Resource } from 'typings';
import { defaultFailure, endLoading, startLoading } from '@actions';

const success = createAction<Actions.GetResourcesPayload, string, Resource.GetResourceResponse>(
  ActionTypes.RES_GET_LIST_SUCCESS,
  (eventSource, response) => ({
    eventSource,
    response,
  })
);

/** リソース一覧取得 */
export const getResources: Actions.GetResourcesAction = (service: string) => async (dispatch, _, api) => {
  dispatch(startLoading());

  try {
    const response = await api.get<Resource.GetResourceResponse>(Consts.GET_RESOURCES_URL(service));

    dispatch(success(`${service}.amazonaws.com`, response));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};
