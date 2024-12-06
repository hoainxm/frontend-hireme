/** @format */

import axios from 'axios';
import { doDelete, doPatch, doPost } from '../../../common/utils/baseAPI';

export const doCreateAIPackageAPI = (name: string) => {
  return doPost('api/ai-package/', { name });
};

export const doUpdateAIPackageAPI = (id: string, name: string) => {
  return doPatch(`api/ai-package/${id}/`, { name });
};

export const doDeleteAIPackage = (id: string) => {
  return doDelete(`api/ai-package/${id}/`);
};

const BASE_URL = 'http://your-api-url.com/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchData = (endpoint: string) => api.get(`/${endpoint}`);
export const createData = (endpoint: string, data: any) => api.post(`/${endpoint}`, data);
export const updateData = (endpoint: string, id: string, data: any) => api.put(`/${endpoint}/${id}`, data);
export const deleteData = (endpoint: string, id: string) => api.delete(`/${endpoint}/${id}`);
