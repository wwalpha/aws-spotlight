import { Tables } from '.';

/** Domain State */
export interface State {
  app: App;
  resources: Resources;
}

/** Application State */
export interface App {
  open: boolean;
  title: string;
  isLoading: boolean;
}

/** Resources State */
export interface Resources {
  datas: Record<string, Tables.Resource[]>;
}
