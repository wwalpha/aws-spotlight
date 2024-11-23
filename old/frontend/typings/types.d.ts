import {
  Action,
  ActionFunction0,
  ActionFunction1,
  ActionFunction2,
  ActionFunction3,
  ActionFunctionAny,
} from 'redux-actions';
import { CallHistoryMethodAction } from 'connected-react-router';
import { ThunkAction } from 'redux-thunk';
import { State } from './domains';

export interface APIClass {
  get<T = any>(path: string, headers?: any, name?: string): Promise<T>;
  put<T = any>(path: string, body?: any, name?: string): Promise<T>;
  post<T = any>(path: string, body?: any, name?: string): Promise<T>;
  del<T = any>(path: string, body?: any, name?: string): Promise<T>;
}

/** Thunk Action */
export type ThunkActions<S = any, R = any> = ThunkAction<
  R,
  State,
  APIClass,
  Action<S | ErrorPayload> | CallHistoryMethodAction
>;

/** Redux Action0 */
export type ReduxAction0<S = any, R = void> = ActionFunction0<ThunkActions<S, R>>;
/** Redux Action1 */
export type ReduxAction1<P, S = any, R = void> = ActionFunction1<P, ThunkActions<S, R>>;
/** Redux Action2 */
export type ReduxAction2<P1, P2, S = any, R = void> = ActionFunction2<P1, P2, ThunkActions<S, R>>;
/** Redux Action3 */
export type ReduxAction3<P1, P2, P3, S = any, R = void> = ActionFunction3<P1, P2, P3, ThunkActions<S, R>>;
/** Redux Action Any */
export type ReduxActionAny<S = any, R = void> = ActionFunctionAny<ThunkActions<S, R>>;

/** Request Action */
export type RequestAction = ActionFunction0<Action<any>>;
/** Failure Action */
export type FailureAction = ActionFunction1<Error, Action<ErrorPayload>>;
/** Success Action */
export interface SuccessAction2<T, P> {
  type: T;
  payload: P;
}
/** Error Payload */
export interface ErrorPayload {
  error: Error;
}
