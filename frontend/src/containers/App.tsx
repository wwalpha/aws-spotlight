import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Paths } from '@constants';
import { Header, ReleaseNotes, Sidemenu } from '.';
import Service from './Service';

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
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.EC2]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RDS]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.DYNAMODB]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.APIGATEWAY]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.ELB]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.EFS]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.EKS]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.S3]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.DS]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.IAM]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.LAMBDA]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.ES]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.REDSHIFT]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.CODEBUILD]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.APPMESH]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.ROUTE53]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.SNS]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.SQS]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.CONNECT]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.KINESIS]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.FIREHOSE]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.CLOUDFRONT]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.LEX]} component={Service} />
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.STEP_FUNCTION]} component={Service} />
        </Switch>
      </Box>
    </Box>
  );
};

export default App;
