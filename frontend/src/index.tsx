import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';
import store, { history } from './store';
import theme from './Theme';
import Authenticator from './Authenticator';
import Auth from '@aws-amplify/auth';
import API from '@aws-amplify/api';

Auth.configure({
  // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
  identityPoolId: process.env.IDENTITY_POOL_ID,

  // REQUIRED - Amazon Cognito Region
  region: process.env.AWS_REGION,

  // OPTIONAL - Amazon Cognito Federated Identity Pool Region
  // Required only if it's different from Amazon Cognito Region
  identityPoolRegion: process.env.AWS_REGION,

  // OPTIONAL - Amazon Cognito User Pool ID
  userPoolId: process.env.USER_POOL_ID,

  // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,

  // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
  mandatorySignIn: false,

  // OPTIONAL - Hosted UI configuration
  oauth: {
    // domain: process.env.AUTH_DOMAIN,
    scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    redirectSignIn: process.env.AUTH_SIGN_IN_URL,
    redirectSignOut: process.env.AUTH_SIGN_OUT_URL,
    responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
  },
});

API.configure({
  endpoints: [
    {
      name: 'api',
      endpoint: process.env.API_URL,
      region: process.env.AWS_REGION,
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
        <Authenticator />
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>
);

const root = document.getElementById('root');

// 画面描画
render(provider, root);
