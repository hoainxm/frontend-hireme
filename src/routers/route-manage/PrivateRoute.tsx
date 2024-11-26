/** @format */

import React, { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { PageURL, ScopeKey, ScopeValue } from '../../models/enum';

interface Props extends RouteProps {
  path: PageURL;
}

const PrivateRoute: FC<Props> = (props: Props) => {
  const { component, path, exact } = props;
  let isAuthenticated = localStorage.getItem(ScopeKey.IS_AUTHENTICATED);

  return (isAuthenticated as ScopeValue) === ScopeValue.TRUE ? (
    <Route path={path} component={component} exact={exact} />
  ) : (
    <Redirect to={`${PageURL.LOGIN}`} />
  );
};

export default PrivateRoute;
