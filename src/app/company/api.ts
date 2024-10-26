import { ApiResponse, doGet } from '../../common/utils/baseAPI';
import { Company } from './model';

const companyAPIUrl = 'api/v1/companies';

export const getInfoCompany = (companyId: string): Promise<ApiResponse<Company>> => {
  return doGet(`${companyAPIUrl}/${companyId}`);
};
