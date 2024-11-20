/** @format */

import { doGet, doPost, doPut, doDelete } from '../../../../../common/utils/baseAPI';

/** Fetch a paginated list of CVs */
export const fetchCVs = (page: number, pageSize: number) => {
  return doGet('/cvs', { page, pageSize });
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
  return doDelete(`/cvs/${id}`);
};
