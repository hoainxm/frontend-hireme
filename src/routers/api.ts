/** @format */

import axios, { AxiosPromise } from "axios";

import { doGet } from "../common/utils/baseAPI";

export const getConfig = (): AxiosPromise<any> => {
  return doGet("api/system/front-end-config");
};

export const getBackEndConfig = (): AxiosPromise<any> => {
  return doGet("api/system/back-end-config");
};
