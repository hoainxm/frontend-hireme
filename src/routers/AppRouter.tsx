/** @format */

import React, { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import HTTP404 from "../app/404";
import { PageURL, ScopeKey, ScopeValue } from "../models/enum";
import { ADMIN_ROUTE, PRIVATE_ROUTE, PUBLIC_ROUTE } from "./constant";
import PublicRoute from "./route-manage/PublicRoute";
import AdminRoute from "./route-manage/AdminRoute";
import PrivateRoute from "./route-manage/PrivateRoute";
import PopupLayout from "../common/ui/layout/popup-layout";

import { useSelector } from "react-redux";
import { RootState } from "@models/rootReducer";
import { CToast } from "@base/toast";

const AppRouter: FC = () => {
  const { t } = useTranslation();
  const { toasts } = useSelector((state: RootState) => state.toasts)

  const checkAdmin = (): boolean => {
    const checkAdmin = localStorage.getItem(ScopeKey.IS_SYSTEM_ADMIN);
    return (checkAdmin as ScopeValue) === ScopeValue.TRUE;
  };

  useEffect(() => {
    document.title = t("title.name");
  }, [t]);

  return (
    <PopupLayout>
      <Router>
        <Switch>
          {PUBLIC_ROUTE.map((route, index) => (
            <PublicRoute key={index} {...route} exact={true} />
          ))}
          {!checkAdmin()
            ? PRIVATE_ROUTE.map((route, index) => <PrivateRoute key={index} {...route} exact />)
            : ADMIN_ROUTE.map((route, index) => <AdminRoute key={index} {...route} exact />)}
          <Redirect path='/admin' to={PageURL.ADMIN_LOGIN} />
          <Redirect path='/' to={PageURL.HOME} />
          <Route component={HTTP404} />
        </Switch>
      </Router>
      {toasts.map((toast, index) => (
        <CToast key={index} {...toast} />
      ))}
    </PopupLayout>
  );
};

export default AppRouter;
