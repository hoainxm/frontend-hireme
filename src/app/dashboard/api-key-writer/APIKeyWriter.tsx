/** @format */

import { AIAPIKey, TenantInfo } from '../model';
import { ButtonVariant, FormAction } from '../../../models/enum';
import { CButton, CInput, CInputHint, CModal } from '../../../common/ui/base';
import { LICENSE_TYPE, PURCHASED_LICENSE } from '../../../common/utils/constants';
import React, { FC, useEffect, useRef, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { createAIAPIKeyAPI, getTenantAPI, updateAIAPIKeyAPI } from '../api';

import AIFeatureList from '../../admin/dashboard/ai-api-key/writer/AIFeatureList';
import { APIKeyForm } from '../form';
import { APIResponse } from '../../../common/utils/baseAPI';
import { Alert } from '../../../common/utils/popup';
import { AxiosError } from 'axios';
import { CSSelect } from '../../../common/ui/base/select';
import { Form } from 'react-bootstrap';
import { RootState } from '../../../store/rootReducer';
import { handleErrorNoPermission } from '../../../common/utils/common';
import style from '../cloudFeature.module.scss';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  initialAPILicense?: AIAPIKey;
  toggle: () => void;
  onSuccess: (location: AIAPIKey, action: FormAction) => void;
  isSysAdminSite: boolean;
}

const APIKeyWriter: FC<Props> = (props: Props) => {
  const { isOpen, initialAPILicense, toggle, onSuccess, isSysAdminSite } = props;
  const { t } = useTranslation();
  const userInfo = useSelector((state: RootState) => state.main.userInfo);
  const { register, errors, handleSubmit } = useForm<APIKeyForm>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tenants, setTenants] = useState<Array<TenantInfo>>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>();
  const [selectedLicenseType, setSelectedLicenseType] = useState<number | string>();

  const isLoadingRef = useRef<boolean>(false);
  const tSearchRef = useRef<string>('');
  const tCurrentPage = useRef<number>(1);
  const tTotalPage = useRef<number>(1);
  const initialTenantRef = useRef<Array<TenantInfo>>([]);
  const initTenantTotalPage = useRef<number>(0);

  const doCreateAIAPIKey = (data: APIKeyForm) => {
    createAIAPIKeyAPI(data)
      .then((res) => onSuccess(res.data, FormAction.CREATE))
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
      .then((res) => onSuccess(res.data, FormAction.UPDATE))
      .catch(handleCatchError)
      .finally(() => setIsLoading(false));
  };

  const onAddValid: SubmitHandler<APIKeyForm> = (data) => {
    console.log('DatA: ', data);
    setIsLoading(true);
    if (userInfo && !isSysAdminSite) {
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
    console.log('DatA: ', event);

    event?.target.classList.add('wasvalidated');
  };

  const handleCatchError = (error: AxiosError) => {
    if (error.response?.status === 403) handleErrorNoPermission(error, t);
    else if (error.response?.data?.package == 'User has already taken this package') {
      Alert.error({ title: 'Oops!', content: t('aipackage.package.duplicate') });
    } else Alert.error({ title: 'Oops!', content: t('error.stWrong') });
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
    if (isSysAdminSite) getTenants(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CModal isOpened={isOpen} toggle={toggle} modalHeader={<h3>{t(`ai.apikey.${initialAPILicense ? 'info' : 'add'}`)}</h3>} size='sm'>
      <Form
        className={`${style.apiKeyForm} ${Object.keys(errors).length !== 0 && 'wasvalidated'}`}
        noValidate
        onSubmit={handleSubmit(onAddValid, onAddInvalid)}
      >
        <div className={style.content}>
          <div className={style.contentBlock}>
            {!!initialAPILicense && (
              <Form.Group>
                <Form.Label>{t('field.info.license.key')}</Form.Label>
                <CInput value={initialAPILicense.api_key} disabled />
              </Form.Group>
            )}
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
            {isSysAdminSite && (
              <>
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
              </>
            )}

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
          </div>
        </div>
        <div className={style.btnGroup}>
          <CButton type='button' label={t('btn.cancel')} variant={ButtonVariant.OUTLINE} disabled={isLoading} onClick={toggle} />
          <CButton type='submit' label={t('btn.save')} loading={isLoading} />
        </div>
      </Form>
    </CModal>
  );
};

export default APIKeyWriter;
