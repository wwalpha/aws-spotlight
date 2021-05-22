import React, { FunctionComponent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Header, Sidemenu } from '.';

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    root: {
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 10%',
    },
  })
);

const App: FunctionComponent<any> = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Header />
      <Sidemenu />
    </React.Fragment>
  );
};

export default App;
