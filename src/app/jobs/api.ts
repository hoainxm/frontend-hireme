import { fileAPIUrl, jobsAPIUrl, resumeAPIUrl } from '../../common/utils/constants';
import { ApiResponse, doGet, doPost } from '../../common/utils/baseAPI';
import { Job } from './model';
/** @format */

export const getAllJobs = (): Promise<ApiResponse<Job[]>> => {
  return doGet(`${jobsAPIUrl}/getAllJobs`);
};

export const fetchJobById = (jobId: string): Promise<ApiResponse<Job>> => {
  return doGet(`${jobsAPIUrl}/${jobId}`);
};

export const fetchJobBySkill = (skills: string[]): Promise<ApiResponse<Job[]>> => {
  return doPost(`${jobsAPIUrl}/fetchJobBySkills`, { skills });
};

export const applyFile = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('fileUpload', file);
  return doPost(`${fileAPIUrl}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      folder_type: 'resume',
    },
  });
};

export const createResume = async (data: { url: string; companyId: string; jobId: string }): Promise<ApiResponse<any>> => {
  return doPost(`${resumeAPIUrl}`, data);
};
