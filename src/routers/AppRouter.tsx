import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
import { PageURL, ScopeKey, ScopeValue } from '../models/enum';
import { ADMIN_ROUTE, PRIVATE_ROUTE, PUBLIC_ROUTE, HR_ROUTE } from './constant';
import PublicRoute from './route-manage/PublicRoute';
import AdminRoute from './route-manage/AdminRoute';
import PrivateRoute from './route-manage/PrivateRoute';
import HrRoute from './route-manage/HrRoute';
import PopupLayout from '../common/ui/layout/popup-layout';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { CToast } from '@base/toast';

const AppRouter: FC = () => {
  const { t } = useTranslation();
  const { toasts } = useSelector((state: RootState) => state.toasts);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isHr, setIsHr] = useState(false);

  useEffect(() => {
    const updateRoles = () => {
      const checkAdmin = localStorage.getItem(ScopeKey.IS_SYSTEM_ADMIN) === ScopeValue.TRUE;
      const checkHr = localStorage.getItem(ScopeKey.IS_SYSTEM_HR) === ScopeValue.TRUE;

      setIsAdmin(checkAdmin);
      setIsHr(checkHr);
    };

    updateRoles();

    window.addEventListener('storage', updateRoles);
    return () => {
      window.removeEventListener('storage', updateRoles);
    };
  }, []);

  useEffect(() => {
    document.title = t('title.name');
  }, [t]);

  return (
    <PopupLayout>
      <Router>
        <Switch>
          {isAdmin && ADMIN_ROUTE.map((route, index) => <AdminRoute key={index} {...route} exact />)}

          {isHr && HR_ROUTE.map((route, index) => <HrRoute key={index} {...route} exact />)}

          {!isAdmin && !isHr && PUBLIC_ROUTE.map((route, index) => <PublicRoute key={index} {...route} exact={true} />)}

          {!isAdmin && !isHr && PRIVATE_ROUTE.map((route, index) => <PrivateRoute key={index} {...route} exact />)}

          {isAdmin && <Redirect to={PageURL.ADMIN_MANAGE} />}
          {isHr && <Redirect to={PageURL.HR_MANAGE} />}
          <Redirect to={PageURL.HOME} />
        </Switch>
      </Router>

      {toasts.map((toast, index) => (
        <CToast key={index} {...toast} />
      ))}
    </PopupLayout>
  );
};

export default AppRouter;
