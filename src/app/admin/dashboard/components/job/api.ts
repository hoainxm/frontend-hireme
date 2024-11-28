/** @format */

import { ApiResponse, APIResponse, doDelete, doGet, doPost } from '../../../../../common/utils/baseAPI';
import axios from 'axios';
import { UserProfile, UserProfileByAdmin } from '../../../../auth/models';
import { companiesAPIUrl, userAPIUrl, jobsAPIUrl } from '../../../../../common/utils/constants';
import { Company } from '../../../../company/model';
import { Job } from '../../../../jobs/model';

const getToken = () => localStorage.getItem('access_token');
const BASE_URL = '/jobs';

export const fetchJobsByAdmin = async (
  current: number,
  pageSize: number
): Promise<ApiResponse<{ meta: { current: number; pageSize: number; pages: number; total: number }; result: Job[] }>> => {
  return doGet(`${jobsAPIUrl}?current=${current}&pageSize=${pageSize}`);
};

export const createJob = async (data: Job): Promise<ApiResponse<Job>> => {
  return doPost(`${jobsAPIUrl}`, data);
};

export const deleteJob = async (jobId: string) => {
  return doDelete(`${jobsAPIUrl}/${jobId}`);
};
