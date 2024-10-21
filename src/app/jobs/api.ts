import { doGet } from '../../common/utils/baseAPI';
import { BASE_URL } from './../../common/utils/constants';
/** @format */

import axios, { AxiosPromise } from 'axios';

const jobsAPIUrl = 'api/v1/jobs';

export const getAllJobs = (): AxiosPromise<any> => {
  return doGet(`${jobsAPIUrl}/getAllJobs`);
};

export const fetchJobById = (jobId: string) => {
  return doGet(`${jobsAPIUrl}/${jobId}`);
};
