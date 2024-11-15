/** @format */

import React, { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { PageURL, ScopeKey, ScopeValue } from '../../models/enum';

interface Props extends RouteProps {
  path: PageURL;
}

const AdminRoute: FC<Props> = (props: Props) => {
  const { component, path, exact } = props;
  let isSysAdmin = localStorage.getItem(ScopeKey.IS_SYSTEM_ADMIN);
  let isAuthenticated = localStorage.getItem(ScopeKey.IS_AUTHENTICATED);

  return (isSysAdmin as ScopeValue) === ScopeValue.TRUE && (isAuthenticated as ScopeValue) === ScopeValue.TRUE ? (
    <Route path={path} component={component} exact={exact} />
  ) : (
    <Redirect to={`${PageURL.ADMIN_LOGIN}`} />
  );
};

export default AdminRoute;
