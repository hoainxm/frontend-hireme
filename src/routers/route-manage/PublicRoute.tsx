/** @format */

import React, { FC } from "react";
import { Route, RouteProps } from "react-router-dom";
import { PageURL } from "../../models/enum";

interface Props extends RouteProps {
  path: PageURL;
}

const PublicRoute: FC<Props> = (props: Props) => {
  const { path, component, exact } = props;
  return <Route path={path} component={component} exact={exact} />;
};

export default PublicRoute;
