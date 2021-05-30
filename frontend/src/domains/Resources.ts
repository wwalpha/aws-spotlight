import { immerable, produce } from 'immer';
import { Actions, Tables } from 'typings';

export default class Resources {
  [immerable] = true;

  datas: Record<string, Tables.Resource[]> = {};

  /** save resources */
  setResources({ eventSource, response }: Actions.GetResourcesPayload) {
    return produce(this, (draft) => {
      draft.datas[eventSource] = response.items;
    });
  }
}
