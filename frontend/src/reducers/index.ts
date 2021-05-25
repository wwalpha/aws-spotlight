import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import App from './app';
import Resources from './resources';

export default (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    app: App,
    resources: Resources,
  });
