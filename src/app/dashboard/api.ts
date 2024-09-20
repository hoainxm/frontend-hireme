/** @format */

import {
  doDelete,
  doGet,
  doPatch,
  doPost,
  doPut,
} from "../../common/utils/baseAPI";

import { AIFeatureItem } from "./model";
import { APIKeyForm } from "./form";
import { AxiosPromise } from "axios";

export const getAIAPIKey = (
  page: number,
  page_size: number = 5,
  tenant?: string,
  aiPackage?: string
) => {
  return doGet("api/api-key/", {
    page,
    page_size,
    tenant,
    ai_package: aiPackage,
  });
};

export const getTenantAPIKey = (page: number, pageSize: number) => {
  return doGet("api/api-key/tenant/", {
    page,
    page_size: pageSize,
  });
};

export const deleteAIAPIKeyAPI = (id: string) => {
  return doDelete(`api/api-key/${id}/`);
};

export const createAIAPIKeyAPI = (data: APIKeyForm) => {
  return doPost("api/api-key/", data);
};

export const updateAIAPIKeyAPI = (id: string, data: APIKeyForm) => {
  return doPut(`api/api-key/${id}/`, data);
};

export const doGetAIPackage = (
  page: number,
  page_size: number = 5,
  search_value?: string
) => {
  return doGet("api/ai-package/", { page, page_size, search_value });
};

export const doGetPackageByIdAPI = (id: string) => {
  return doGet(`api/ai-package/${id}/`);
};

export const doCreateAIPackageAPI = (name: string) => {
  return doPost("api/ai-package/", { name });
};

export const doUpdateAIPackageAPI = (id: string, name: string) => {
  return doPatch(`api/ai-package/${id}/`, { name });
};

export const getTenantAPI = (
  page: number,
  name?: string
): AxiosPromise<any> => {
  return doGet("api/tenant/", { page, name });
};

export const doDeleteAIPackage = (id: string) => {
  return doDelete(`api/ai-package/${id}/`);
};

export const getAIFeatureAPI = () => {
  return doGet("api/ai-feature/");
};

export const getAIFeaturePackageAPI = (id: string) => {
  return doGet(`api/ai-package/${id}/features/`);
};

export const updateAIFeatureOfPackageAPI = (
  packageId: string,
  data: Array<AIFeatureItem>
) => {
  return doPost(`api/ai-package/${packageId}/features/`, data);
};
