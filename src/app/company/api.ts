import { doGet } from '../../common/utils/baseAPI';

import { AxiosPromise } from 'axios';

const companyAPIUrl = 'api/v1/companies';

export const getInfoCompany = (companyId: string): AxiosPromise<any> => {
  return doGet(`${companyAPIUrl}/${companyId}`);
};
