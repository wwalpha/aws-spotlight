import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import Auth from '@aws-amplify/auth';
import API from '@aws-amplify/api';
import { MuiThemeProvider } from '@material-ui/core/styles';
import store, { history } from './store';
import theme from './Theme';
import Authenticator from './Authenticator';
import { App } from '@containers';
import { Consts, Environments } from '@constants';

Auth.configure({
  // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
  identityPoolId: Environments.IDENTITY_POOL_ID,

  // REQUIRED - Amazon Cognito Region
  region: Environments.AWS_DEFAULT_REGION,

  // OPTIONAL - Amazon Cognito Federated Identity Pool Region
  // Required only if it's different from Amazon Cognito Region
  identityPoolRegion: Environments.AWS_DEFAULT_REGION,

  // OPTIONAL - Amazon Cognito User Pool ID
  userPoolId: Environments.USER_POOL_ID,

  // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  userPoolWebClientId: Environments.USER_POOL_WEB_CLIENT_ID,

  // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
  mandatorySignIn: false,

  // OPTIONAL - Hosted UI configuration
  oauth: {
    // domain: Environments.AUTH_DOMAIN,
    scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    redirectSignIn: Environments.AUTH_SIGN_IN_URL,
    redirectSignOut: Environments.AUTH_SIGN_OUT_URL,
    responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
  },
});

API.configure({
  endpoints: [
    {
      name: Consts.API_NAME,
      endpoint: Environments.API_URL,
      region: Environments.AWS_DEFAULT_REGION,
      custom_header: async () => {
        return { Authorization: (await Auth.currentSession()).getIdToken().getJwtToken() };
      },
    },
  ],
});

const provider = (
  <Provider store={store}>
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
