import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NewPassword, SignIn, App, Initialize } from '@containers';
import { AppActions } from '@actions';
import { Domains } from 'typings';

const appState = (state: Domains.State) => state.app;

const Authenticator: React.FunctionComponent = () => {
  const [isLogin, setLogin] = React.useState<boolean>();
  const { authorizationToken, newPasswordRequired, initialized } = useSelector(appState);
  const dispatch = useDispatch();
  const actions = bindActionCreators(AppActions, dispatch);

  React.useEffect(() => {
    setLogin(authorizationToken !== null);

    // initialize start
    actions.initialize();
  }, [authorizationToken]);

  // new password required
  if (newPasswordRequired === true) {
    return <NewPassword />;
  }

  // logined
  if (!isLogin && !authorizationToken) {
    return <SignIn />;
  }

  // logined
  if (!initialized) {
    return <Initialize />;
  }

  return <App />;
};

export default Authenticator;
