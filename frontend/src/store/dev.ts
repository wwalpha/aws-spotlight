import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import { History } from 'history';
import logger from 'redux-logger';
import reducers from '../reducers';
import { API } from '@utils';

const store = (history: History<any>) =>
  createStore(
    reducers(history),
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history), thunk.withExtraArgument(API), logger)
      // other store enhancers if any
    )
  );

// if (module.hot) {
//   module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').default));
// }

export default store;
