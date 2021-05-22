import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core';
import { ConnectedRouter } from 'connected-react-router';
import store, { history } from './store';
import theme from './Theme';
// import Router from './Router';
import App from './containers/App';

const provider = (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>
);

const root = document.getElementById('root');

// 画面描画
render(provider, root);
