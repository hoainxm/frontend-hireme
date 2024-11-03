import { BASE_URL } from '../../common/utils/constants';
/** @format */

import axios, { AxiosPromise } from 'axios';
import { ApiResponse, doGet, doPost } from '../../common/utils/baseAPI';
import { UserProfile } from '../auth/models';

const authAPIUrl = 'api/v1/auth';

const getToken = () => localStorage.getItem('access_token');

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

export const getUserProfile = async (): Promise<{ data: UserProfile }> => {
  return doGet(`${authAPIUrl}/users/profile`);
};

export const updateUserProfile = (userId: string, values: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
  return doPost(`${authAPIUrl}/${userId}`, values);
};
