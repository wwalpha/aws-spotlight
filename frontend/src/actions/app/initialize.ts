import { createAction } from 'redux-actions';
import { ActionTypes } from '@constants';
import { endLoading, startLoading } from '@actions';
import { Actions, Resource, System } from 'typings';
import { Consts } from '@constants';

const success = createAction<
  Actions.InitializePayload,
  Resource.GetCategoryResponse,
  System.ReleaseResponse,
  System.VersionResponse
>(ActionTypes.APP_INITIALIZE_SUCCESS, (categories, releaseNotes, version) => ({
  categories,
  releaseNotes,
  version,
}));

/** ログイン */
export const initialize: Actions.InitializeAction = () => async (dispatch, _, api) => {
  dispatch(startLoading());

  try {
    const datas = await Promise.all([
      api.get(Consts.API_URLs.GetCategories),
      api.get(Consts.API_URLs.GetReleaseNotes),
      api.get(Consts.API_URLs.GetVersion),
    ]);

    dispatch(success(datas[0], datas[1], datas[2]));
  } catch (err) {
    dispatch(endLoading());
  } finally {
    dispatch(endLoading());
  }
};
