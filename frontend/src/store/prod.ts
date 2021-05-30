import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import logger from 'redux-logger';
import reducers from '../reducers';
import { API } from '@utils';

export const history = createBrowserHistory();

const store = createStore(
  reducers(history),
  applyMiddleware(routerMiddleware(history), thunk.withExtraArgument(API), logger)
);

export default store;
