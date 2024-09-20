/** @format */

import { AxiosPromise } from "axios";
import { doGet, doPost } from "../../common/utils/baseAPI";
import { Tenant } from "./models";
import { LoginFormInputs, RegisterFormInputs, ForgotPasswordFormInputs, ResetPasswordFormInputs } from "./forms";

const authAPIUrl = "api/auth"

export const getTenantByIdAPI = (id: string): AxiosPromise<Tenant> => {
  return doGet(`api/tenant/${id}/`);
};

export const doLogin = (loginData: LoginFormInputs): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/web-token/`, loginData);
};

export const doRegister = (
  registerData: RegisterFormInputs
): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/register`, registerData);
};

export const doAdminLogin = (loginData: LoginFormInputs): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/token/`, loginData);
};

export const generateTokenResetPassword = (data: ForgotPasswordFormInputs): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/reset-password/token/generate`, data)
}

export const doCheckResetPassword = (token: string): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/reset-password/token/verify`, { token })
}

export const doResetPassword = (data: ResetPasswordFormInputs): AxiosPromise<any> => {
  return doPost(`${authAPIUrl}/resetPassword`, data);
};
