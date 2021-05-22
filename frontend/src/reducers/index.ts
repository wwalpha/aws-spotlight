import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import App from './app';

export default (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    app: App,
  });
