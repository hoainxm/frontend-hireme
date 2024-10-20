import { BASE_URL } from './../../common/utils/constants';
/** @format */

import axios, { AxiosPromise } from 'axios';
import { doGet, doPost } from '../../common/utils/baseAPI';

const authAPIUrl = 'api/v1/auth';

export const fetchJobDetail = (jobId: string) => {
  return axios
    .get(`${authAPIUrl}/jobs/${jobId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching job data:', error);
      throw error; // Rethrow error so it can be handled in the component
    });
};

// export const getJobDetailbyJobId = (jobId: string) => {
//   return doGet(`${authAPIUrl}/jobs/${jobId}`);
// };
