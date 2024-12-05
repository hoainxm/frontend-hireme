/** @format */

import { ApiResponse, APIResponse, doDelete, doGet, doPost, doPut } from '../../../../../common/utils/baseAPI';
import axios from 'axios';
import { UserProfile, UserProfileByAdmin } from '../../../../auth/models';
import { resumeAPIUrl } from '../../../../../common/utils/constants';
import { Company } from '../../../../company/model';
import { Job } from '../../../../jobs/model';
import { CV } from './model';

const getToken = () => localStorage.getItem('access_token');
const BASE_URL = '/jobs';

export const fetchCVsByAdmin = async (
  current: number,
  pageSize: number
): Promise<ApiResponse<{ meta: { current: number; pageSize: number; pages: number; total: number }; result: CV[] }>> => {
  return doGet(`${resumeAPIUrl}?current=${current}&pageSize=${pageSize}`);
};

/** Fetch a specific CV by ID */
export const fetchCVById = (id: string) => {
  return doGet(`/cvs/${id}`);
};

/** Create a new CV */
export const createCV = (data: { name: string; description: string; owner: string }) => {
  return doPost('/cvs', data);
};

/** Update an existing CV */
export const updateCV = (id: string, data: { name: string; description: string }) => {
  return doPut(`/cvs/${id}`, data);
};

/** Delete a CV */
export const deleteCV = (id: string) => {
  return doDelete(`${resumeAPIUrl}/${id}`);
};
