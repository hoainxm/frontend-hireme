import { ApiResponse, doPost } from '../../common/utils/baseAPI';
import axios from 'axios';

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

export const updatePassword = (data: {
  token: string;
  email: string;
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse<{ token: string; email: string; currentPassword: string; newPassword: string }>> => {
  return doPost(`${userAPIUrl}/update-password`, data);
};
