/** @format */

import { doDelete, doPatch, doPost } from "../../../common/utils/baseAPI";

import { AIFeatureItem } from "../../dashboard/model";

export const doCreateAIPackageAPI = (name: string) => {
  return doPost("api/ai-package/", { name });
};

export const doUpdateAIPackageAPI = (id: string, name: string) => {
  return doPatch(`api/ai-package/${id}/`, { name });
};

export const doDeleteAIPackage = (id: string) => {
  return doDelete(`api/ai-package/${id}/`);
};

export const updateAIFeatureOfPackageAPI = (
  packageId: string,
  data: Array<AIFeatureItem>
) => {
  return doPost(`api/ai-package/${packageId}/features/`, data);
};

