import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NewPassword, SignIn, App, Initialize } from '@containers';
import { AppActions } from '@actions';
import { Credentials } from './store';
import { Token } from '@utils';
import { Domains } from 'typings';

const appState = (state: Domains.State) => state.app;

const Authenticator: React.FunctionComponent = () => {
  const [isLogin, setLogin] = React.useState<boolean>();
  const { signResponse, newPasswordRequired, initialized } = useSelector(appState);
  const dispatch = useDispatch();
  const actions = bindActionCreators(AppActions, dispatch);

  React.useEffect(() => {
    const session = async () => {
      const credentials = await Credentials.getSession();

      if (!credentials && !signResponse) {
        return;
      }

      // user signed
      if (signResponse) {
        const { idToken, accessToken, refreshToken } = signResponse;
        if (!idToken || !accessToken || !refreshToken) return;
        const username = Token.getUsername(accessToken);
        // username
        Credentials.setUsername(username);
        // tokens cache
        Credentials.setUserTokens({
          idToken: idToken,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }

      // set login status
      setLogin(true);
      // initialize start
      actions.initialize();
    };

    session();
  }, [isLogin, signResponse]);

  // new password required
  if (newPasswordRequired === true) {
    return <NewPassword />;
  }

  // logined
  if (!isLogin && !signResponse) {
    return <SignIn />;
  }

  // logined
  if (!initialized) {
    return <Initialize />;
  }

  return <App />;
};

export default Authenticator;
