import { immerable, produce } from 'immer';

export default class App {
  [immerable] = true;

  open: boolean = false;

  /** sidemenu show/hide */
  sidemenu(open: boolean) {
    return produce(this, (draft) => {
      draft.open = open;
    });
  }
}
