import { immerable, produce } from 'immer';

export default class App {
  [immerable] = true;

  open: boolean = false;
  title: string = 'AWS RESOURCE MANAGEMENT SYSTEM';

  /** sidemenu show/hide */
  sidemenu(open: boolean) {
    return produce(this, (draft) => {
      draft.open = open;
    });
  }

  setTitle(title: string) {
    return produce(this, (draft) => {
      draft.title = title;
    });
  }
}
