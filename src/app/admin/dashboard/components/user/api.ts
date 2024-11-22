import { ApiResponse, APIResponse, doGet } from '../../../../../common/utils/baseAPI';
import axios from 'axios';
import { UserProfile, UserProfileByAdmin } from '../../../../auth/models';
import { userAPIUrl } from '../../../../../common/utils/constants';

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

export const fetchUsersByAdmin = (
  current: number,
  pageSize: number
): Promise<ApiResponse<{ meta: { current: number; pageSize: number; pages: number; total: number }; result: UserProfileByAdmin[] }>> => {
  return doGet(`${userAPIUrl}?current=${current}&pageSize=${pageSize}`);
};

// export const deleteUser = async (userId: string): Promise<void> => {
//   return axios.delete(`${BASE_URL}/users/${userId}`);
// };

// export const createUser = async (userData: Partial<UserProfile>): Promise<UserProfile> => {
//   return axios.post(`${BASE_URL}/users`, userData);
// };

// export const updateUser = async (userId: string, userData: Partial<UserProfile>): Promise<UserProfile> => {
//   return axios.put(`${BASE_URL}/users/${userId}`, userData);
// };
