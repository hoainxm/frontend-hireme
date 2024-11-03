import { Job } from 'app/jobs/model';
import { ApiResponse, doGet } from '../../common/utils/baseAPI';
import { Company } from '../company/model';

const companyAPIUrl = 'api/v1/companies';
const jobsAPIUrl = 'api/v1/jobs';

export const getInfoCompany = (companyId: string): Promise<ApiResponse<Company>> => {
  return doGet(`${companyAPIUrl}/${companyId}`);
};

export const getAllCompanies = (current: number, pageSize: number): Promise<ApiResponse<Company[]>> => {
  return doGet(`${companyAPIUrl}/?current=${current}&pageSize=${pageSize}`);
};

// export const getJobsByCompany = (companyId: string): Promise<ApiResponse<Job[]>> => {
//   return doGet(`/companies/${companyId}/jobs`);
// };

export const getJobsByCompany = (companyId: string): Promise<ApiResponse<Job[]>> => {
  return doGet(`${jobsAPIUrl}/company/${companyId}`);
};
