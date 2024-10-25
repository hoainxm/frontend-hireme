import { doGet, doPost } from '../../common/utils/baseAPI';
import { BASE_URL } from './../../common/utils/constants';
/** @format */

import axios, { AxiosPromise } from 'axios';

const jobsAPIUrl = 'api/v1/jobs';

export const getAllJobs = (): AxiosPromise<any> => {
  return doGet(`${jobsAPIUrl}/getAllJobs`);
};

export const fetchJobById = (jobId: string): AxiosPromise<any> => {
  return doGet(`${jobsAPIUrl}/${jobId}`);
};

export const fetchJobBySkill = (skills: string[]): AxiosPromise<any> => {
  return doPost(`${jobsAPIUrl}/searchBySkills`, { skills });
};
