import { ActionTypes } from '@constants';
import { createAction } from 'redux-actions';
import { FailureAction, RequestAction } from 'typings';

/** Common Request Actions */
export const request = (actionType: string): RequestAction => createAction(actionType);
/** Common Failure Actions */
export const failure = (actionType: string): FailureAction => createAction(actionType, (error: Error) => ({ error }));

/** default failure action */
export const defaultFailure = failure(ActionTypes.COM_01_FAILURE);

export * as AppActions from './app';
