import { APIResponse } from '../../../../../common/utils/baseAPI';
import axios from 'axios';
import { UserProfile } from '../../../../auth/models';

const BASE_URL = `${process.env.REACT_APP_API_URL}/api/v1`;

export const fetchUsers = async (page: number, pageSize: number): Promise<APIResponse<UserProfile>> => {
  return axios.get(`${BASE_URL}/users`, {
    params: {
      page,
      page_size: pageSize,
    },
  });
};

export const deleteUser = async (userId: string): Promise<void> => {
  return axios.delete(`${BASE_URL}/users/${userId}`);
};

export const createUser = async (userData: Partial<UserProfile>): Promise<UserProfile> => {
  return axios.post(`${BASE_URL}/users`, userData);
};

export const updateUser = async (userId: string, userData: Partial<UserProfile>): Promise<UserProfile> => {
  return axios.put(`${BASE_URL}/users/${userId}`, userData);
};
