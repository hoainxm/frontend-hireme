/** @format */

import { ApiResponse, doGet, doPost, doPut, doDelete, doPatch } from '../../common/utils/baseAPI';
import { jobsAPIUrl, resumeAPIUrl } from '../../common/utils/constants';
import { Job } from '../jobs/model';
import { Resume, ResumeStatus } from './model';

export const createJob = async (data: {
  name: string;
  skills: string[];
  companyId: string;
  location: string;
  salary: number;
  quantity: number;
  level: string;
  description: string;
  startDate: string;
  endDate: string;
  workForm: string[];
  gender: string;
  experience: number;
  isActive: boolean;
}): Promise<ApiResponse<Job>> => {
  return doPost(`${jobsAPIUrl}`, data);
};

export const editJob = async (
  id: string,
  data: {
    name: string;
    skills: string[];
    salary: number;
    quantity: number;
    level: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    workForm: string[];
    gender: string;
    experience: number;
    isActive: boolean;
  }
): Promise<ApiResponse<Job>> => {
  return doPatch(`${jobsAPIUrl}/${id}`, data);
};

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
  return doPost(`${resumeAPIUrl}`, data);
};

// export const updateResume = async (id: string, data: { status: string }): Promise<ApiResponse<Resume>> => {
//   return doPut(`${resumeAPIUrl}/${id}`, data);
// };

export const updateResumeStatus = async (id: string, status: ResumeStatus): Promise<void> => {
  return doPatch(`${resumeAPIUrl}/${id}`, { status });
};

export const deleteResume = async (id: string): Promise<ApiResponse<void>> => {
  return doDelete(`${resumeAPIUrl}/${id}`);
};
