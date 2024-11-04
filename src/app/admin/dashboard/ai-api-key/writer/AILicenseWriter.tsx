/** @format */

import { AIAPIKey, TenantInfo } from '../../../../../app/dashboard/model';
import { ButtonVariant, FormAction, PageName, PageURL, RequestLimitType } from '../../../../../models/enum';
import { CInput, CInputHint } from '@base/input';
import { Col, Form, Row } from 'react-bootstrap';
import { LICENSE_TYPE, LIMIT_TYPE_TRANSLATE, NORMAL_NUMBER_PATTERN } from '../../../../../common/utils/constants';
import React, { FC, useEffect, useRef, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { createAIAPIKeyAPI, getTenantAPI, updateAIAPIKeyAPI } from '../../../../../app/dashboard/api';

import AIFeatureList from './AIFeatureList';
import { APIKeyForm } from '../../../../../app/dashboard/form';
import { APIResponse } from '../../../../../common/utils/baseAPI';
import AdminContentLayout from '../../../../../common/ui/layout/admin-content-layout';
import { Alert } from '../../../../../common/utils/popup';
import { AxiosError } from 'axios';
import CButton from '@base/button';
import { CSSelect } from '@base/select';
import { RootState } from '../../../../../store/rootReducer';
import { handleErrorNoPermission } from '../../../../../common/utils/common';
import style from './license.module.scss';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface Props {
  id: string;
  initialAPILicense?: AIAPIKey;
}

const AILicenseWriter: FC<Props> = (props: Props) => {
  const { initialAPILicense } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const userInfo = useSelector((state: RootState) => state.main.userInfo);
  const { register, errors, handleSubmit } = useForm<APIKeyForm>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tenants, setTenants] = useState<Array<TenantInfo>>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>();
  const [selectedLicenseType, setSelectedLicenseType] = useState<number | string>();
  const [isLimit, setIsLimit] = useState<boolean>();

  const isLoadingRef = useRef<boolean>(false);
  const tSearchRef = useRef<string>('');
  const tCurrentPage = useRef<number>(1);
  const tTotalPage = useRef<number>(1);
  const initialTenantRef = useRef<Array<TenantInfo>>([]);
  const initTenantTotalPage = useRef<number>(0);

  const onSuccess = () => {
    Alert.success({ title: t('sucess.title'), content: t('action.success') });
    history.goBack();
  };

  const doCreateAIAPIKey = (data: APIKeyForm) => {
    createAIAPIKeyAPI(data)
      .then((res) => onSuccess())
      .catch(handleCatchError)
      .finally(() => setIsLoading(false));
  };

  const doUpdateAIAPIKey = (id: string, data: APIKeyForm) => {
    if (initialAPILicense) {
      data.type = initialAPILicense.type;
      if (initialAPILicense.package) {
        data.package = initialAPILicense.package.id;
      }
      if (initialAPILicense.ai_feature) {
        data.ai_feature = initialAPILicense.ai_feature.id;
      }
    }

    updateAIAPIKeyAPI(id, data)
      .then((res) => onSuccess())
      .catch(handleCatchError)
      .finally(() => setIsLoading(false));
  };

  const onAddValid: SubmitHandler<APIKeyForm> = (data) => {
    console.log('DatA: ', data);
    setIsLoading(true);
    if (userInfo) {
      data.tenant = userInfo?.tenant;
    }

    if (initialAPILicense) {
      data.tenant = initialAPILicense.tenant.id;
      data.package = initialAPILicense.package ? initialAPILicense.package.id : '';
      doUpdateAIAPIKey(initialAPILicense.id, {
        ...data,
        tenant: initialAPILicense.tenant.id,
      });
    } else doCreateAIAPIKey(data);
  };

  const onAddInvalid: SubmitErrorHandler<APIKeyForm> = (_, event) => {
    event?.target.classList.add('wasvalidated');
  };

  const errorCodeMapping = (errorCode: string) => {
    const ERROR_CODE: { [key: string]: string } = {
      2000: 'ai.license.exist',
      2001: 'ai.license.request_limit',
    };
    return Alert.error({ title: 'Oops!', content: t(ERROR_CODE[errorCode]) });
  };

  const handleCatchError = (error: AxiosError) => {
    if (error.response?.status === 403) handleErrorNoPermission(error, t);
    else if (error.response?.data?.package == 'User has already taken this package') {
      return Alert.error({ title: 'Oops!', content: t('aipackage.package.duplicate') });
    }

    if (error.response?.data?.error_code) {
      return errorCodeMapping(error.response?.data?.error_code.length > 0 ? error.response?.data?.error_code[0] : error.response?.data?.error_code);
    }
    Alert.error({ title: 'Oops!', content: t('error.stWrong') });
  };

  const getTenants = (page: number, searchValue?: string): void => {
    isLoadingRef.current = true;
    getTenantAPI(page, searchValue || tSearchRef.current)
      .then((res) => {
        const data: APIResponse<TenantInfo> = res.data;
        if (!initialTenantRef.current.length) initialTenantRef.current = data.results;
        if (initialAPILicense?.tenant.id && data.results.some((item) => item.id === initialAPILicense.tenant.id)) {
          tenants.splice(0, 1);
        }

        setTenants(page === 1 ? data.results : tenants.concat(data.results));
        tCurrentPage.current = data.page;
        tTotalPage.current = Math.ceil(data.total / data.page_size);
        if (!initTenantTotalPage.current) initTenantTotalPage.current = tTotalPage.current;
      })
      .catch(handleCatchError)
      .finally(() => (isLoadingRef.current = false));
  };

  const onTenantScroll = (boundElem: HTMLDivElement | null, contentElem: HTMLTableElement | null) => {
    if (!boundElem || !contentElem || isLoadingRef.current) return;
    if (tCurrentPage.current < tTotalPage.current && boundElem.offsetHeight >= contentElem.scrollHeight - (boundElem.scrollTop + 16))
      getTenants(tCurrentPage.current + 1);
  };

  const handleCheckLimit = (value: boolean) => {
    setIsLimit(value);
  };

  const resetInitialData = () => {
    tTotalPage.current = initTenantTotalPage.current;
    tCurrentPage.current = 1;
    tSearchRef.current = '';
  };

  useEffect(() => {
    setSelectedTenant(initialAPILicense?.tenant.id);
    setSelectedLicenseType(initialAPILicense?.type);
    resetInitialData();
    if (!initialAPILicense) return;
    // const isExistInitialPackage = initialPackageRef.current.some(
    //   (item) => item.id === initialAPIKey.package?.id
    // );
    // if (initialAPIKey.package && isExistInitialPackage)
    //   initialPackageRef.current.unshift(initialAPIKey.package);
    // setPackages(Array.from(initialPackageRef.current));
    const isExistInitialTenant = initialTenantRef.current.some((item) => item.id === initialAPILicense.tenant.id);
    setTenants(isExistInitialTenant ? [...initialTenantRef.current] : [initialAPILicense.tenant, ...initialTenantRef.current]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAPILicense]);

  useEffect(() => {
    // getAIPackage(1);
    getTenants(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminContentLayout
      activate={PageName.ADMIN_DASHBOARD}
      backTo={`${PageURL.ADMIN}/?tab=atab`}
      title={t(`ai.apikey.${initialAPILicense ? 'info' : 'add'}`)}
    >
      <Form
        className={`${style.apiKeyForm} ${Object.keys(errors).length !== 0 && 'wasvalidated'}`}
        noValidate
        onSubmit={handleSubmit(onAddValid, onAddInvalid)}
      >
        <Row className={style.contentBlock}>
          <Col sm='12' md='6' lg='6'>
            <AIFeatureList
              initialAPIKey={initialAPILicense}
              isLoadingRef={isLoadingRef}
              errors={errors}
              register={register}
              handleCatchError={handleCatchError}
            />
            {!!initialAPILicense && (
              <Form.Group>
                <Form.Label>{t('field.info.license.key')}</Form.Label>
                <CInput value={initialAPILicense.api_key} disabled />
              </Form.Group>
            )}
            <Form.Group>
              <Form.Label className='required'>{t('field.licenseType')}</Form.Label>
              <CSSelect
                name='type'
                iref={register({
                  required: 'field.error.required',
                })}
                valid={!errors.type}
                disabled={!!initialAPILicense}
                defaultValue={selectedLicenseType}
                onChangeSelect={(data) => setSelectedLicenseType(data?.value)}
              >
                {LICENSE_TYPE.map((item, index) => (
                  <option key={index} title={t(item.label)} value={item.value}>
                    {t(item.label)}
                  </option>
                ))}
              </CSSelect>
              {errors.type && <CInputHint>{t(`${errors.type.message}`)}</CInputHint>}
            </Form.Group>
            <Form.Group>
              <Form.Label className='required'>{t('tenant.name')}</Form.Label>
              <CSSelect
                name='tenant'
                iref={register({
                  required: 'field.error.required',
                })}
                valid={!errors.tenant}
                onSearch={(data) => {
                  tSearchRef.current = data;
                  getTenants(1, data);
                }}
                disabled={!!initialAPILicense}
                onScrollContent={onTenantScroll}
                defaultValue={selectedTenant}
                onChangeSelect={(data) => setSelectedTenant(data?.value)}
                searchValueListener={tSearchRef.current}
              >
                {tenants.map((item, index) => (
                  <option key={index} title={item.name} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </CSSelect>
              {errors.tenant && <CInputHint>{t(`${errors.tenant.message}`)}</CInputHint>}
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('ai.apikey.webhook')}</Form.Label>
              <CInput
                name='web_hook_url'
                placeholder={t('field.webhook.input')}
                iref={register()}
                valid={!errors.web_hook_url}
                defaultValue={initialAPILicense?.web_hook_url}
              />
              {errors.web_hook_url && <CInputHint>{t(`${errors.web_hook_url.message}`)}</CInputHint>}
            </Form.Group>
          </Col>
          <Col sm='12' md='6' lg='6' className={style.leftCol}>
            <Form.Group className={style.checkBox}>
              <Form.Check
                custom
                type='checkbox'
                label={t('field.limitNumUsed')}
                id='enableLimit'
                checked={isLimit}
                onChange={(e) => handleCheckLimit(e.currentTarget.checked)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>{t('field.limitType')}</Form.Label>
              <CSSelect
                name='limit_type'
                disabled={!isLimit}
                iref={register({})}
                defaultValue={RequestLimitType.REQUEST}
                onChangeSelect={(data) => {}}
                canUncheck={false}
              >
                <option key={1} title={t(LIMIT_TYPE_TRANSLATE[RequestLimitType.REQUEST])} value={RequestLimitType.REQUEST}>
                  {t(LIMIT_TYPE_TRANSLATE[RequestLimitType.REQUEST])}
                </option>
              </CSSelect>
            </Form.Group>
            <Form.Group>
              <Form.Label className='required'>{t('aipackage.requestNum')}</Form.Label>
              <CInput
                name='request_limit'
                disabled={!isLimit}
                placeholder={t('aipackage.hint.requestNum')}
                onChange={(e) => {}}
                valid={!errors.request_limit}
                iref={
                  isLimit
                    ? register({
                        required: 'field.error.required',
                        min: 1,
                        max: 10000,
                        pattern: NORMAL_NUMBER_PATTERN,
                      })
                    : undefined
                }
              />
              {errors.request_limit && errors.request_limit.type === 'required' && <CInputHint>{t('field.error.required')}</CInputHint>}
              {errors.request_limit && errors.request_limit.type === 'min' && <CInputHint>{`${t('field.error.min')} 1`}</CInputHint>}
              {errors.request_limit && errors.request_limit.type === 'max' && <CInputHint>{`${t('field.error.max')} 10000`}</CInputHint>}
              {errors.request_limit && errors.request_limit.type === 'pattern' && <CInputHint>{`${t('field.error.numberOnly')}`}</CInputHint>}
            </Form.Group>
          </Col>
        </Row>
        <div className={style.btnGroup}>
          <CButton type='button' label={t('btn.cancel')} variant={ButtonVariant.OUTLINE} disabled={isLoading} onClick={() => history.goBack()} />
          <CButton type='submit' label={t('btn.save')} loading={isLoading} />
        </div>
      </Form>
    </AdminContentLayout>
  );
};
export default AILicenseWriter;
