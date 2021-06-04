// import * as React from 'react';
// import { App } from '@containers';
// import { AmplifyAuthContainer, AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
// import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

// const Authenticator: React.FunctionComponent = () => {
//   const [authState, setAuthState] = React.useState<AuthState>();
//   const [user, setUser] = React.useState<object | undefined>();

//   React.useEffect(() => {
//     return onAuthUIStateChange((nextAuthState, authData) => {
//       setAuthState(nextAuthState);
//       setUser(authData);
//     });
//   }, []);

//   // logined
//   if (authState === AuthState.SignedIn && user) {
//     return <App />;
//   }

//   return (
//     <AmplifyAuthContainer>
//       <AmplifyAuthenticator>
//         <App />
//         <AmplifySignIn slot="sign-in" usernameAlias="email" hideSignUp />
//       </AmplifyAuthenticator>
//     </AmplifyAuthContainer>
//   );
// };

// export default Authenticator;
