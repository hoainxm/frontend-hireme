import { BASE_URL } from './../../common/utils/constants';
/** @format */

import axios, { AxiosPromise } from 'axios';
import { doGet, doPost } from '../../common/utils/baseAPI';
import { Tenant } from './models';
import { LoginFormInputs, RegisterFormInputs, ForgotPasswordFormInputs, ResetPasswordFormInputs, Login } from './forms';

const authAPIUrl = 'api/v1/auth';
// const authAPIUrl = `${BASE_URL}/api/auth`;

const getToken = () => localStorage.getItem('access_token');

export const getTenantByIdAPI = (id: string): AxiosPromise<Tenant> => {
  return doGet(`api/tenant/${id}/`);
};

// Cấu hình axios để thêm Authorization header nếu có token
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const doLogin = (loginData: LoginFormInputs): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/web-token/`, loginData);
};

export const doRegister = (registerData: RegisterFormInputs): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/register`, registerData);
};

export const doAdminLogin = (loginData: LoginFormInputs): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/token/`, loginData);
};

export const generateTokenResetPassword = (data: ForgotPasswordFormInputs): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/reset-password/token/generate`, data);
};

export const doCheckResetPassword = (token: string): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/reset-password/token/verify`, { token });
};

export const doResetPassword = (data: ResetPasswordFormInputs): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/resetPassword`, data);
};

export const loginApi = (loginData: Login) => {
  return doPost(`${authAPIUrl}/login`, loginData);
  // return axios.post('http://localhost:8000/api/v1/auth/login', loginData);
};
