import * as React from 'react';
import { useSelector } from 'react-redux';
import { NewPassword, SignIn } from '@containers';
import { Domains } from 'typings';

const appState = (state: Domains.State) => state.app;

const Authenticator: React.FunctionComponent = ({ children }) => {
  const [isLogin, setLogin] = React.useState<boolean>();
  const { authorizationToken, newPasswordRequired } = useSelector(appState);

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

  return <React.Fragment>{children}</React.Fragment>;
};

export default Authenticator;
