/** @format */

import { ScopeKey, ScopeValue } from '../../../models/enum';

export const useAuth = () => {
  const isAuthenticated = localStorage.getItem(ScopeKey.IS_AUTHENTICATED) === ScopeValue.TRUE;
  const isAdmin = localStorage.getItem(ScopeKey.IS_SYSTEM_ADMIN) === ScopeValue.TRUE;

  return { isAuthenticated, isAdmin };
};
