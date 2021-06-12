import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { AppActions } from '@actions';
import { NewPassword, SignIn, App } from '@containers';
import { Domains } from 'typings';

const appState = (state: Domains.State) => state.app;

const Authenticator: React.FunctionComponent = () => {
  const [isLogin, setLogin] = React.useState<boolean>();
  const { authorizationToken, newPasswordRequired } = useSelector(appState);
  const dispatch = useDispatch();
  const actions = bindActionCreators(AppActions, dispatch);

  React.useEffect(() => {
    setLogin(authorizationToken !== null);

    // get categories
    actions.categories();
  }, [authorizationToken]);

  // new password required
  if (newPasswordRequired === true) {
    return <NewPassword />;
  }

  // logined
  if (!isLogin) {
    return <SignIn />;
  }

  return <App />;
};

export default Authenticator;
