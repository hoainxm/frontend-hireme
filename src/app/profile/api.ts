import { BASE_URL, fileAPIUrl, resumeAPIUrl, userAPIUrl } from '../../common/utils/constants';
/** @format */

import axios, { AxiosPromise } from 'axios';
import { ApiResponse, doGet, doPost } from '../../common/utils/baseAPI';
import { UserProfile } from '../../app/auth/models';
import { Resume } from './model';

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

export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  return doGet(`${userAPIUrl}/profile`);
};

export const getResumeByUser = async (): Promise<ApiResponse<Resume[]>> => {
  return doPost(`${resumeAPIUrl}/by-user`);
};

export const uploadAvatar = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('fileUpload', file);
  return doPost(`${fileAPIUrl}/upload-avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      folder_type: 'avatar',
    },
  });
};

export const uploadCV = async (file: File): Promise<any> => {
  if (file.type !== 'application/pdf') {
    throw new Error('Vui lòng chỉ tải lên file PDF.');
  }
  const formData = new FormData();
  formData.append('fileUpload', file);
  return doPost(`${fileAPIUrl}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      folder_type: 'resume',
    },
  });
};
