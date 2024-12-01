/** @format */

import { ApiResponse, APIResponse, doDelete, doGet, doPost } from '../../../../../common/utils/baseAPI';
import axios from 'axios';
import { UserProfile, UserProfileByAdmin } from '../../../../auth/models';
import { companiesAPIUrl, fileAPIUrl, userAPIUrl } from '../../../../../common/utils/constants';
import { Company } from 'app/company/model';

const getToken = () => localStorage.getItem('access_to ken');

export const fetchCompaniesByAdmin = async (
  current: number,
  pageSize: number
): Promise<ApiResponse<{ meta: { current: number; pageSize: number; pages: number; total: number }; result: Company[] }>> => {
  return doGet(`${companiesAPIUrl}?current=${current}&pageSize=${pageSize}`);
};

export const createCompany = async (data: Company): Promise<ApiResponse<Company>> => {
  return doPost(`${companiesAPIUrl}`, data);
};

export const uploadLogo = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('fileUpload', file);
  return doPost(`${fileAPIUrl}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      folder_type: 'company',
    },
  });
};

export const deleteCompany = async (companyId: string) => {
  return doDelete(`${companiesAPIUrl}/${companyId}`);
};
