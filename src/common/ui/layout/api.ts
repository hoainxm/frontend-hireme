/** @format */

import { AxiosPromise } from "axios";
import { doGet, doPost, doPut } from "../../utils/baseAPI";

export const getProfile = (): AxiosPromise<any> => {
  return doGet("api/user/info");
};

export const doLogout = (): AxiosPromise<any> => {
  return doGet("api/auth/logout");
};

export const doGetWelcomeInfo = (): AxiosPromise<any> => {
  return doGet("api/welcome-info/");
};

export const doCreateWelcomeInfo = (data: FormData): AxiosPromise<any> => {
  return doPost("api/welcome-info/", data);
};

export const doUpdateWelcomeInfo = (
  id: number,
  data: FormData
): AxiosPromise<any> => {
  return doPut(`api/welcome-info/${id}/`, data);
};

export const createTrialAPIKey = (ai_feature_id: number) => {
  return doPost("api/license/user/trial", { ai_feature_id })
}

export const getListTrialAPIKey = () => {
  return doGet("api/license/user/api-key/")
}