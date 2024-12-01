import { paymentAPIUrl, subscriberAPIUrl, userAPIUrl } from '../../common/utils/constants';
import { ApiResponse, doGet, doPost } from '../../common/utils/baseAPI';
import axios from 'axios';

/** @format */

const getToken = () => localStorage.getItem('access_token');

axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const doPostCreatePayment = (data: { amount: number; ipAddr: string }): Promise<ApiResponse<any>> => {
  return doPost(`${paymentAPIUrl}/create-payment`, data);
};

export const doGetVerifyTransaction = (data: { txnRef: string; vnp_Amount: string }): Promise<any> => {
  const queryParams = new URLSearchParams(data).toString();
  return doGet(`${paymentAPIUrl}/verify?${queryParams}`);
};

export const setPremium = (data: { typePre: string }): Promise<ApiResponse<any>> => {
  return doPost(`${userAPIUrl}/set-premium`, data);
};

export const setSubscriber = (data: { name: string; email: string; skills: string[] }): Promise<ApiResponse<any>> => {
  return doPost(`${subscriberAPIUrl}`, data);
};
