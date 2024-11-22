/** @format */

import { ApiResponse, APIResponse, doDelete, doGet, doPost } from '../../../../../common/utils/baseAPI';
import axios from 'axios';
import { UserProfile, UserProfileByAdmin } from '../../../../auth/models';
import { companiesAPIUrl, userAPIUrl } from '../../../../../common/utils/constants';
import { Company } from 'app/company/model';

const getToken = () => localStorage.getItem('access_token');
const BASE_URL = '/companies';

export const fetchCompaniesByAdmin = async (
  current: number,
  pageSize: number
): Promise<ApiResponse<{ meta: { current: number; pageSize: number; pages: number; total: number }; result: Company[] }>> => {
  return doGet(`${companiesAPIUrl}?current=${current}&pageSize=${pageSize}`);
};

export const createCompany = async (companyData: Record<string, any>) => {
  return doPost(`${BASE_URL}`, companyData);
};

export const deleteCompany = async (companyId: string) => {
  return doDelete(`${companiesAPIUrl}/${companyId}`);
};
