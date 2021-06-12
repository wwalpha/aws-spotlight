import { createAction } from 'redux-actions';
import { ActionTypes } from '@constants';
import { endLoading, startLoading } from '@actions';
import { Actions, Resource } from 'typings';
import { Consts } from '@constants';

const success = createAction<Actions.GetCategoriesPayload, string[]>(
  ActionTypes.APP_CATEGORIES_SUCCESS,
  (categories) => ({
    categories,
  })
);

/** ログイン */
export const categories: Actions.GetCategoriesAction = () => async (dispatch, _, api) => {
  dispatch(startLoading());

  try {
    const res = await api.get<Resource.GetCategoryResponse>(Consts.API_URLs.GetCategories);

    dispatch(success(res.categories));
  } catch (err) {
    dispatch(endLoading());
  } finally {
    dispatch(endLoading());
  }
};
