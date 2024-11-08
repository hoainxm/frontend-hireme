/** @format */

import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { ApiResponse, doGet, doPost, doPut } from '../../utils/baseAPI';
import { UserProfile } from 'app/auth/models';

const authAPIUrl = 'api/v1/auth';

export const doLogout = (): Promise<ApiResponse<any>> => {
  return doPost(`${authAPIUrl}/logout`);
};

export const doGetWelcomeInfo = (): AxiosPromise<any> => {
  return doGet('api/welcome-info/');
};

export const doCreateWelcomeInfo = (data: FormData): AxiosPromise<any> => {
  return doPost('api/welcome-info/', data);
};

export const doUpdateWelcomeInfo = (id: number, data: FormData): AxiosPromise<any> => {
  return doPut(`api/welcome-info/${id}/`, data);
};

export const createTrialAPIKey = (ai_feature_id: number) => {
  return doPost('api/license/user/trial', { ai_feature_id });
};

export const getListTrialAPIKey = () => {
  return doGet('api/license/user/api-key/');
};
