import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { App } from '@containers';
import { Paths } from '@constants';

class Router extends React.Component<any, any> {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Root]} component={App} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default Router;
