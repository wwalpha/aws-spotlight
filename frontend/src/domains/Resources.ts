import { immerable, produce } from 'immer';
import { Resource, Tables } from 'typings';

export default class Resources {
  [immerable] = true;

  datas: Record<string, Tables.Resource[]> = {};

  /** save resources */
  setResources({ items }: Resource.GetResourceResponse) {
    return produce(this, (draft) => {
      if (items.length > 0) {
        const source = items[0].EventSource;

        draft.datas[source] = items;
      }
    });
  }
}
