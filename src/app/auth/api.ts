import { authAPIUrl, BASE_URL, userAPIUrl } from './../../common/utils/constants';
/** @format */

import axios, { AxiosPromise } from 'axios';
import { ApiResponse, doGet, doPost } from '../../common/utils/baseAPI';

import { LoginFormInputs, RegisterFormInputs, ForgotPasswordFormInputs, EmailVerifyFormInputs, IUserResponse } from './forms';

// const authAPIUrl = `${BASE_URL}/api/auth`;

const getToken = () => localStorage.getItem('access_token');

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

export const doRegister = (registerData: RegisterFormInputs): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/register`, registerData);
};

export const doAdminLogin = (loginData: LoginFormInputs): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/token/`, loginData);
};

export const generateTokenResetPassword = (data: ForgotPasswordFormInputs): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/reset-password/token/generate`, data);
};

export const forgotPassword = (data: ForgotPasswordFormInputs): Promise<ApiResponse<ForgotPasswordFormInputs>> => {
  return doPost(`${userAPIUrl}/forgot-password`, data);
};

export const resetPassword = (data: { token: string; newPassword: string }): Promise<ApiResponse<{ token: string; newPassword: string }>> => {
  return doPost(`${userAPIUrl}/reset-password`, data);
};

export const doLogin = (data: LoginFormInputs): Promise<ApiResponse<IUserResponse>> => {
  return doPost(`${authAPIUrl}/login`, data);
};

export const doReSendVerifyEmail = (data: EmailVerifyFormInputs): AxiosPromise<any> => {
  return doGet(`${authAPIUrl}/resend-verify-email?email=${data.email}`);
};

export const doVerifyEmailToken = (tokenCheckVerify: string): Promise<ApiResponse<any>> => {
  return doGet(`${authAPIUrl}/verify-email?tokenCheckVerify=${tokenCheckVerify}`);
};
