/** @format */

import { doGet, doPost, doPut, doDelete } from '../../../../../common/utils/baseAPI';

const BASE_URL = '/companies';

export const fetchCompanies = async (page: number, pageSize: number) => {
  return doGet(`${BASE_URL}`, { page, page_size: pageSize });
};

export const createCompany = async (companyData: Record<string, any>) => {
  return doPost(`${BASE_URL}`, companyData);
};

export const deleteCompany = async (companyId: string) => {
  return doDelete(`${BASE_URL}/${companyId}`);
};
