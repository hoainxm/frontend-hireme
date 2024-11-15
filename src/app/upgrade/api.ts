import { paymentAPIUrl } from '../../common/utils/constants';
import { ApiResponse, doGet, doPost } from '../../common/utils/baseAPI';
import axios, { AxiosRequestConfig } from 'axios';
import { response } from 'express';
import { PageURL } from '@models/enum';
/** @format */

export const doGetCreatePayment = async (params: { amount: number; ipAddr: string }) => {
  const returnURL = PageURL.UPGRADE;
  return doGet(`${paymentAPIUrl}/create-payment`, { ...params, vnp_ReturnUrl: returnURL });
};
