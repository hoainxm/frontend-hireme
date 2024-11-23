/** @format */

import { ApiResponse, doGet, doPost, doPut, doDelete } from '../../common/utils/baseAPI';
import { jobsAPIUrl, resumeAPIUrl } from '../../common/utils/constants';
import { Job } from '../jobs/model';
import { Resume } from './model';

export const fetchJobsByHR = async (
  current: number,
  pageSize: number
): Promise<ApiResponse<{ meta: { current: number; pageSize: number; pages: number; total: number }; result: Job[] }>> => {
  return doGet(`${jobsAPIUrl}/by-hr?current=${current}&pageSize=${pageSize}`);
};

export const fetchResumesByHR = async (
  current: number,
  pageSize: number
): Promise<ApiResponse<{ meta: { current: number; pageSize: number; pages: number; total: number }; result: Resume[] }>> => {
  return doGet(
    `${resumeAPIUrl}/by-hr?current=${current}&pageSize=${pageSize}&populate=companyId,jobId&fields=companyId._id,companyId.name,companyId.logo,jobId._id,jobId.name`
  );
};

export const fetchResumeById = async (id: string): Promise<ApiResponse<Resume>> => {
  return doGet(`${resumeAPIUrl}/${id}`);
};

export const createResume = async (data: { email: string; jobId: string; companyId: string; url: string }): Promise<ApiResponse<Resume>> => {
  return doPost(resumeAPIUrl, data);
};

export const updateResume = async (id: string, data: { status: string }): Promise<ApiResponse<Resume>> => {
  return doPut(`${resumeAPIUrl}/${id}`, data);
};

export const deleteResume = async (id: string): Promise<ApiResponse<void>> => {
  return doDelete(`${resumeAPIUrl}/${id}`);
};
