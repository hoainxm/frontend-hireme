import { ApiResponse, doDelete, doGet } from '../../../../../common/utils/baseAPI';
import { permissionAPIUrl } from '../../../../../common/utils/constants';
import { Permission } from './model';

export const fetchPermissionByAdmin = async (
  current: number,
  pageSize: number
): Promise<ApiResponse<{ meta: { current: number; pageSize: number; pages: number; total: number }; result: Permission[] }>> => {
  return doGet(`${permissionAPIUrl}?current=${current}&pageSize=${pageSize}`);
};

// export const deleteRole = async (roleId: string) => {
//   return doDelete(`${permissionAPIUrl}/${roleId}`);
// };
