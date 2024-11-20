/** @format */

import { doGet, doPost, doPut, doDelete } from '../../../../../common/utils/baseAPI';

const BASE_URL = '/jobs';

export const fetchJobs = async (page: number, pageSize: number) => {
  return doGet(`${BASE_URL}`, { page, page_size: pageSize });
};

export const createJob = async (jobData: Record<string, any>) => {
  return doPost(`${BASE_URL}`, jobData);
};

export const deleteJob = async (jobId: string) => {
  return doDelete(`${BASE_URL}/${jobId}`);
};
