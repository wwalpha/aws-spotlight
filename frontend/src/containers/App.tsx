import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Paths } from '@constants';
import { Services } from '@containers';
import { Header, Sidemenu } from '.';
import ReleaseNotes from './ReleaseNotes';

const useStyles = makeStyles(({}: Theme) =>
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
    <Box display="flex" height="100vh">
      <Sidemenu />
      <Box display="flex" flexDirection="column" flexGrow="1">
        <Header />
        <Switch>
          <Route exact path="/" component={ReleaseNotes} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.EC2]} component={Services.EC2} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RDS]} component={Services.RDS} />
        </Switch>
      </Box>
    </Box>
  );
};

export default App;
