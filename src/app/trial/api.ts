import axios, { AxiosPromise } from 'axios';
import { doGet, doPost } from '../../common/utils/baseAPI';
import { DynamicTemplateForm, PreSignalAIResponse } from './model';
import { DynamicTemplateAction } from '@models/enum';

export const requestOCRMedicalDevice = (tenantId: string, apiKey: string, deviceType: string): AxiosPromise<PreSignalAIResponse> => {
  return doPost(
    `api/${tenantId}/link/ocr_hd`,
    {
      device_type: deviceType,
      file_extension: 'png',
      is_visualize: true,
      is_public: false,
    },
    {
      headers: {
        'X-API-KEY': apiKey,
      },
    }
  );
};

export const requestOCRPrescription = (tenantId: string, apiKey: string, lang: string): AxiosPromise<PreSignalAIResponse> => {
  return doPost(
    `api/${tenantId}/link/ocr_prescription`,
    {
      lang,
      file_extension: 'png',
      is_visualize: true,
    },
    {
      headers: {
        'X-API-KEY': apiKey,
      },
    }
  );
};

export const requestOCRInbody = (tenantId: string, apiKey: string, template: string): AxiosPromise<PreSignalAIResponse> => {
  return doPost(
    `api/${tenantId}/link/ocr_inbody`,
    {
      template,
      file_extension: 'png',
      is_visualize: true,
    },
    {
      headers: {
        'X-API-KEY': apiKey,
      },
    }
  );
};

export const requestCreateDynamicTemplate = (
  tenantId: string,
  apiKey: string,
  action: DynamicTemplateAction,
  document_type?: string,
  template_name?: string,
  content?: DynamicTemplateForm
): AxiosPromise<PreSignalAIResponse> => {
  return doPost(
    `api/${tenantId}/link/ocr_dynamic`,
    {
      document_type,
      action,
      file_extension: 'png',
      is_visualize: true,
      content,
      template_name,
    },
    {
      headers: {
        'X-API-KEY': apiKey,
      },
    }
  );
};

export const uploadPresignedUrl = (presignedUrl: string, presignedFormData: FormData) => {
  return fetch(presignedUrl, {
    method: 'POST',
    body: presignedFormData,
  });
};

export const noticeFromAI = <T>(tenantId: string, transactionId: string, apiKey: string): AxiosPromise<T> => {
  return axios({
    url: `api/${tenantId}/notice`,
    method: 'POST',
    data: {
      transaction_id: transactionId,
    },
    headers: {
      'X-API-KEY': apiKey,
    },
  });
};

export const getRemainTurn = (featureId: number) => {
  return doGet('api/license/user/api-key/remaining-turns/', {
    ai_feature_id: featureId,
  });
};

export const getDynamicTemplateAPI = (tenant: string) => {
  return doGet(`api/dynamic-template/${tenant}`);
};

export const getDetailDynamicTemplateAPI = (tenant: string, id: number) => {
  return doGet(`api/dynamic-template/${tenant}/${id}/detail`);
};

export const getDynamicTemplateListAPI = (page: number, tenant: string, page_size?: number, searchValue?: string, document_type?: string) => {
  return doGet(`api/dynamic-template/${tenant}/list`, {
    page,
    page_size,
    search_value: searchValue,
    document_type,
  });
};
