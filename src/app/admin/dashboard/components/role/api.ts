import { ApiResponse, doDelete, doGet, doPost } from '../../../../../common/utils/baseAPI';
import { roleAPIUrl } from '../../../../../common/utils/constants';
import { Role } from './model';

export const fetchRoleByAdmin = async (
  current: number,
  pageSize: number
): Promise<ApiResponse<{ meta: { current: number; pageSize: number; pages: number; total: number }; result: Role[] }>> => {
  return doGet(`${roleAPIUrl}?current=${current}&pageSize=${pageSize}`);
};

export const deleteRole = async (roleId: string) => {
  return doDelete(`${roleAPIUrl}/${roleId}`);
};

export const createRole = async (data: {
  name: string;
  description: string;
  isActive: boolean;
  permissions: string[];
}): Promise<ApiResponse<any>> => {
  return doPost(`${roleAPIUrl}`, data);
};

export const fetchRoleById = async (id: string): Promise<ApiResponse<any>> => {
  return doGet(`${roleAPIUrl}/${id}`);
};

export const updateRole = async (data: {
  name: string;
  description: string;
  isActive: boolean;
  permissions: string[];
}): Promise<ApiResponse<any>> => {
  return doPost(`${roleAPIUrl}`, data);
};
