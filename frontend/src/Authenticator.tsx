import * as React from 'react';
import { useSelector } from 'react-redux';
import { NewPassword, SignIn, App } from '@containers';
import { Domains } from 'typings';

const appState = (state: Domains.State) => state.app;

const Authenticator: React.FunctionComponent = () => {
  const [isLogin, setLogin] = React.useState<boolean>();
  const { authorizationToken, newPasswordRequired } = useSelector(appState);

  console.log(authorizationToken, newPasswordRequired);
  React.useEffect(() => {
    setLogin(authorizationToken !== undefined);
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
