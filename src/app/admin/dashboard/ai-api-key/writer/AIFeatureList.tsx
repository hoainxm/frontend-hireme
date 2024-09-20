/** @format */

import { AIAPIKey, AIFeaturePackage } from '../../../../dashboard/model';
import { CButton, CInputHint } from '../../../../../common/ui/base';
import { DeepMap, FieldError, RegisterOptions } from 'react-hook-form';
import React, { FC, useEffect, useRef, useState } from 'react';
import { doGetAIPackage, getAIFeatureAPI } from '../../../../dashboard/api';

import { AI_FEATURE_TRANSLATE } from '../../../../../common/utils/constants';
import { APIKeyForm } from '../../../../dashboard/form';
import { APIResponse } from '../../../../../common/utils/baseAPI';
import { AxiosError } from 'axios';
import { CSSelect } from '../../../../../common/ui/base/select';
import { Form } from 'react-bootstrap';
import style from './license.module.scss';
import { useTranslation } from 'react-i18next';

interface Props {
  initialAPIKey?: AIAPIKey;
  register: (registerOptions: RegisterOptions) => any;
  errors: DeepMap<APIKeyForm, FieldError>;
  isLoadingRef: React.MutableRefObject<boolean>;
  handleCatchError: (error: AxiosError) => void;
}

const AIFeatureList: FC<Props> = (props: Props) => {
  const { initialAPIKey, register, errors, isLoadingRef, handleCatchError } = props;
  const { t } = useTranslation();
  const [isPackage, setIsPackage] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<string>();
  const [selectedAIFeature, setSelectedAIFeature] = useState<number>();
  const [packages, setPackages] = useState<Array<AIFeaturePackage>>([]);
  const [aiFeatures, setAIFeature] = useState<Array<AIFeaturePackage>>([]);

  const initialPackageRef = useRef<Array<AIFeaturePackage>>([]);
  const initPackageTotalPageRef = useRef<number>(0);
  const pCurrentPage = useRef<number>(1);
  const pTotalPage = useRef<number>(1);
  const pSearchRef = useRef<string>('');

  const changePackageChoice = (isPackage: boolean, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPackage(isPackage);
  };

  const doGetAIFeature = () => {
    getAIFeatureAPI()
      .then((res) => setAIFeature(res.data))
      .catch(handleCatchError);
  };

  const getAIPackage = (page: number, searchValue?: string) => {
    isLoadingRef.current = true;
    doGetAIPackage(page, 10, searchValue || pSearchRef.current)
      .then((res) => {
        const data: APIResponse<AIFeaturePackage> = res.data;
        if (!initialPackageRef.current.length) initialPackageRef.current = data.results;
        if (initialAPIKey?.package?.id && data.results.some((item) => item.id === initialAPIKey?.package?.id)) {
          packages.splice(0, 1);
        }
        setPackages(page === 1 ? data.results : packages.concat(data.results));
        pCurrentPage.current = data.page;
        pTotalPage.current = Math.ceil(data.total / data.page_size);
        if (!initPackageTotalPageRef.current) initPackageTotalPageRef.current = pTotalPage.current;
      })
      .catch(props.handleCatchError)
      .finally(() => (isLoadingRef.current = false));
  };

  const onPackageScroll = (boundElem: HTMLDivElement | null, contentElem: HTMLTableElement | null) => {
    if (!boundElem || !contentElem || isLoadingRef.current) return;
    if (pCurrentPage.current < pTotalPage.current && boundElem.offsetHeight >= contentElem.scrollHeight - (boundElem.scrollTop + 16))
      getAIPackage(pCurrentPage.current + 1);
  };

  const resetInitialData = () => {
    pTotalPage.current = initPackageTotalPageRef.current;
    pCurrentPage.current = 1;
    pSearchRef.current = '';
  };

  useEffect(() => {
    getAIPackage(1);
    doGetAIFeature();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initialAPIKey) return;
    setIsPackage(initialAPIKey.package !== null);
    const isExistInitialPackage = initialPackageRef.current.some((item) => item.id === initialAPIKey.package?.id);
    if (initialAPIKey.package && isExistInitialPackage) initialPackageRef.current.unshift(initialAPIKey.package);
    setPackages(Array.from(initialPackageRef.current));
    setSelectedAIFeature(initialAPIKey.ai_feature ? initialAPIKey.ai_feature?.id : undefined);
    setSelectedPackage(initialAPIKey?.package?.id.toString());
    resetInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAPIKey]);

  return (
    <>
      <div className='mb-4 d-inline-block'>
        <div className={style.buttonFrame}>
          <CButton
            disabled={initialAPIKey?.package != null}
            className={!isPackage ? `${style.activeBtn} mr-2` : `${style.disableBtn} mr-2`}
            onClick={(e) => changePackageChoice(false, e)}
          >
            {t('field.featureType')}
          </CButton>
          <CButton
            disabled={initialAPIKey?.ai_feature != null}
            className={isPackage ? style.activeBtn : style.disableBtn}
            onClick={(e) => changePackageChoice(true, e)}
          >
            {t('ai.package')}
          </CButton>
        </div>
      </div>
      {isPackage && (
        <Form.Group>
          <Form.Label className='required'>{t('ai.package')}</Form.Label>
          <CSSelect
            iref={register({
              required: 'field.error.required',
            })}
            name='package'
            valid={!errors.package}
            onSearch={(data) => {
              pSearchRef.current = data;
              getAIPackage(1, data);
            }}
            onScrollContent={onPackageScroll}
            defaultValue={selectedPackage}
            onChangeSelect={(data) => setSelectedPackage(data?.value)}
            searchValueListener={pSearchRef.current}
            disabled={!!initialAPIKey}
          >
            {packages.map((item, index) => (
              <option key={index} title={item.name} value={item.id}>
                {item.name}
              </option>
            ))}
          </CSSelect>
          {errors.package && <CInputHint>{t(`${errors.package.message}`)}</CInputHint>}
        </Form.Group>
      )}

      {!isPackage && (
        <Form.Group>
          <Form.Label className='required'>{t('field.featureType')}</Form.Label>
          <CSSelect
            name='ai_feature'
            disabled={!!initialAPIKey}
            iref={register({
              required: 'field.error.required',
            })}
            valid={!errors.ai_feature}
            defaultValue={selectedAIFeature}
            onChangeSelect={(data) => setSelectedAIFeature(parseInt(data?.value))}
          >
            {aiFeatures.map((packageFeature, position) => (
              <option key={position} title={t(AI_FEATURE_TRANSLATE[packageFeature.name])} value={packageFeature.id}>
                {t(AI_FEATURE_TRANSLATE[packageFeature.name])}
              </option>
            ))}
          </CSSelect>
          {errors.ai_feature && <CInputHint>{t(`${errors.ai_feature.message}`)}</CInputHint>}
        </Form.Group>
      )}
    </>
  );
};

export default AIFeatureList;
