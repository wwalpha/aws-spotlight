/** Domain State */
export interface State {
  app: App;
  resources: Resources;
}

/** Application State */
export interface App {
  open: boolean;
}

/** Resources State */
export interface Resources {}
