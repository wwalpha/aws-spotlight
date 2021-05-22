import React from 'react';
import { FunctionComponent } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Paths } from '@constants';
import { EC2, RDS } from '.';

export const Router: FunctionComponent<any> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={EC2} />
      <Route path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.EC2]} component={EC2} />
      <Route path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RDS]} component={RDS} />
    </Switch>
  );
};
