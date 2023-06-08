import { Consts } from '@constants';
import { Actions } from 'typings';

/** グループ選択 */
export const reports: Actions.GetReportsAction = () => async (dispatch, _, api) => {
  await api.get(Consts.API_URLs.GetReports);
};
