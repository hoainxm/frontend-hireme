/** @format */

import { ScopeKey, ScopeValue } from '../../models/enum';
import axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { decodeBase64, makeClientToUnauthorize } from './common';

import { BASE_URL } from './constants';

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;
axios.interceptors.request.use(
  (config) => {
    const autoAuth = localStorage.getItem(ScopeKey.AUTOMATE_AUTH);
    if (autoAuth) config.headers.common['Automate-authentication'] = decodeBase64(autoAuth.toString());

    const accessToken = decodeBase64(sessionStorage.getItem(ScopeKey.ACCESS_TOKEN) || '');

    if (localStorage.getItem(ScopeKey.AUTOMATE_AUTH) === ScopeValue.NO_AUTOMATE && accessToken && accessToken.length > 0) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // User is Admin
      if (localStorage.getItem(ScopeKey.IS_SYSTEM_ADMIN) === ScopeValue.TRUE) {
        if (localStorage.getItem(ScopeKey.AUTOMATE_AUTH) === ScopeValue.AUTOMATE) {
          return doRefreshToken()
            .then((_) => {
              return axios.request(error.config);
            })
            .catch((e: AxiosError) => {
              if (e.response?.status === 401) makeClientToUnauthorize({ isSysAdmin: true });
            });
        } else {
          makeClientToUnauthorize({ isSysAdmin: true });
        }
      }

      // * User is Client
      // TODO: show popup error message instead of force redirect to “/login” for License, Setting, Profile page.
      // !NOTE: do not update until get those pages

      // if (
      //   localStorage.getItem(ScopeKey.AUTOMATE_AUTH) === ScopeValue.AUTOMATE
      // ) {
      //   return doRefreshToken()
      //     .then((_) => {
      //       return axios.request(error.config);
      //     })
      //     .catch((e: AxiosError) => {
      //       if (error.response?.status === 401) makeClientToUnauthorize();
      //     });
      // } else {
      //   makeClientToUnauthorize();
      // }
    } else {
      return Promise.reject(error);
    }
  }
);

// export const doGet = (url: string, params?: Object): AxiosPromise<any> => {
//   return axios({
//     method: 'GET',
//     url: url,
//     params: params,
//   });
// };

// export const doGetWithToken = (url: string, accessToken?: string, params?: Object): AxiosPromise<any> => {
//   return axios({
//     method: 'GET',
//     url: url,
//     params: params,
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
// };

// export const doPost = (url: string, data?: object | FormData, config?: AxiosRequestConfig): AxiosPromise<any> => {
//   return axios({
//     method: 'POST',
//     url: url,
//     data: data,
//     headers: config?.headers,
//   });
// };

// export const doPostWithToken = (url: string, data: object | FormData, accessToken?: string): AxiosPromise<any> => {
//   return axios({
//     method: 'POST',
//     url: url,
//     data: data,
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
// };

// export const doPut = (url: string, data: object | FormData): AxiosPromise<any> => {
//   return axios({
//     method: 'PUT',
//     url: url,
//     data: data,
//   });
// };

// export const doPatch = (url: string, data: object | FormData): AxiosPromise<any> => {
//   return axios({
//     method: 'PATCH',
//     url: url,
//     data: data,
//   });
// };

// export const doDelete = (url: string, data?: object | FormData): AxiosPromise<any> => {
//   return axios({
//     method: 'DELETE',
//     url: url,
//     data: data,
//   });
// };

// export const doRefreshToken = (): AxiosPromise<any> => {
//   return doPost('api/auth/token/refresh/', {});
// };

// export interface APIResponse<T> {
//   page: number;
//   page_size: number;
//   results: Array<T>;
//   total: number;
//   links: {
//     next: string | null;
//     previous: null | string;
//   };
// }

// tay nguyen

export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export const doGet = <T>(url: string, params?: Object): Promise<T> => {
  return axios.get<T>(url, { params }).then((response: AxiosResponse<T>) => response.data);
};

export const doGetWithToken = <T>(url: string, accessToken?: string, params?: Object): Promise<T> => {
  return axios
    .get<T>(url, {
      params: params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response: AxiosResponse<T>) => response.data);
};

export const doPost = <T>(url: string, data?: object | FormData, config?: AxiosRequestConfig): Promise<T> => {
  return axios.post<T>(url, data, config).then((response: AxiosResponse<T>) => response.data);
};

export const doPostWithToken = <T>(url: string, data: object | FormData, accessToken?: string): Promise<T> => {
  return axios
    .post<T>(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response: AxiosResponse<T>) => response.data);
};

export const doPut = <T>(url: string, data: object | FormData): Promise<T> => {
  return axios.put<T>(url, data).then((response: AxiosResponse<T>) => response.data);
};

export const doPatch = <T>(url: string, data: object | FormData): Promise<T> => {
  return axios.patch<T>(url, data).then((response: AxiosResponse<T>) => response.data);
};

export const doDelete = <T>(url: string, data?: object | FormData): Promise<T> => {
  return axios.delete<T>(url, { data }).then((response: AxiosResponse<T>) => response.data);
};

export const doRefreshToken = (): Promise<any> => {
  return doPost('api/auth/token/refresh/', {});
};

export interface APIResponse<T> {
  page: number;
  page_size: number;
  results: Array<T>;
  total: number;
  links: {
    next: string | null;
    previous: string | null;
  };
}
