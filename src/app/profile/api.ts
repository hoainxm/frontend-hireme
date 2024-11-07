import { BASE_URL } from '../../common/utils/constants';
/** @format */

import axios, { AxiosPromise } from 'axios';
import { doGet } from '../../common/utils/baseAPI';
import { UserProfile } from 'app/auth/models';

const userAPIUrl = 'api/v1/users';

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
  return doGet(`${userAPIUrl}/profile`);
};
