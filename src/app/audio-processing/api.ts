import axios, { AxiosPromise } from 'axios';
import { doPost } from '../../common/utils/baseAPI';

export const requestTTS = (tenantId: string, apiKey: string, data: FormData) => {
    return doPost(`api/${tenantId}/link/tts`, data, {
      headers: {
        "X-API-KEY": apiKey
      }
    }
    )
  };

  export const noticeFromAI = <T>(
    tenantId: string,
    transactionId: string,
    apiKey: string
  ): AxiosPromise<T> => {
    return axios({
      url: `api/${tenantId}/notice`,
      method: "POST",
      data: {
        transaction_id: transactionId
      },
      headers: {
        "X-API-KEY": apiKey
      }
    });
  }