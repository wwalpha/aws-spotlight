/** Domain State */
export interface State {
  app: App;
  resources: Resources;
}

/** Application State */
export interface App {
  open: boolean;
  title: string;
}

/** Resources State */
export interface Resources {}
