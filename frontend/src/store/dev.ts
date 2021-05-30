import { createStore, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHashHistory } from 'history';
import logger from 'redux-logger';
import reducers from '../reducers';
import { API } from '@utils';

export const history = createHashHistory();

const store = createStore(
  reducers(history),
  composeWithDevTools(
    applyMiddleware(routerMiddleware(history), thunk.withExtraArgument(API), logger)
    // other store enhancers if any
  )
);

export default store;

module.hot?.accept('./src/reducers/index.ts', () => {
  console.log(123123123123);
});
