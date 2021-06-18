import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import API from '@aws-amplify/api';
import { MuiThemeProvider } from '@material-ui/core/styles';
import store, { history } from './store';
import theme from './Theme';
import Authenticator from './Authenticator';
import { App } from '@containers';
import { Consts, Environments } from '@constants';

API.configure({
  endpoints: [
    {
      name: Consts.API_NAME,
      endpoint: Environments.BACKEND_API_URL,
      region: Environments.AWS_DEFAULT_REGION,
      custom_header: async () => {
        return { Authorization: window.sessionStorage.getItem('token') };
      },
    },
  ],
});

const provider = (
  <Provider store={store()}>
    <MuiThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        {/* <App /> */}
        <Authenticator />
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>
);

const root = document.getElementById('root');

// 画面描画
render(provider, root);
