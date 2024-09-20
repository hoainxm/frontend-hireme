/** @format */

import { AIFeatureItem, AIFeaturePackage, Package } from '../../../dashboard/model';
import { Alert, Confirm } from '../../../../common/utils/popup';
import { AxiosError, AxiosResponse } from 'axios';
import { CButton, CInput, CInputHint } from '../../../../common/ui/base';
import { Col, Form, Image, Row, Spinner } from 'react-bootstrap';
import { ButtonVariant, FormAction, PageName, PageURL, RequestLimitType } from '../../../../models/enum';
import React, { FC, useEffect, useRef, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { doCreateAIPackageAPI, doUpdateAIPackageAPI, updateAIFeatureOfPackageAPI } from '../api';
import { doGetPackageByIdAPI, getAIFeatureAPI, getAIFeaturePackageAPI } from '../../../dashboard/api';
import { useHistory, useParams } from 'react-router-dom';

import AdminContentLayout from '../../../../common/ui/layout/admin-content-layout';
import PackageFeatureInfo from './PackageFeatureInfo';
import { PackageForm } from '../../../dashboard/form';
import PlusIcon from '../../../../common/ui/assets/ic/16px/plus_blue.svg';
import { handleErrorNoPermission } from '../../../../common/utils/common';
import style from '../cloudFeature.module.scss';
import { useTranslation } from 'react-i18next';

interface Props {
  id: string;
}

type Params = {
  action: FormAction;
  id: string;
};

const AIPackageWriter: FC<Props> = (props: Props) => {
  const { action, id } = useParams<Params>();
  const history = useHistory();
  const { t } = useTranslation();
  const { register, errors, handleSubmit, reset, clearErrors, unregister } = useForm<PackageForm>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [initialPackage, setInitialPackage] = useState<Package>();
  const [aiFeatures, setAIFeature] = useState<Array<AIFeaturePackage>>([]);
  const [AICloudFeatureGroup, setAICloudFeatureGroup] = useState<Array<AIFeatureItem>>([]);
  const AICloudFeatureGroupRef = useRef<Array<AIFeatureItem>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const doGetPackage = (id: string) => {
    doGetPackageByIdAPI(id)
      .then((res) => setInitialPackage(res.data))
      .catch(handleCatchError);
  };

  const doGetAIFeature = () => {
    getAIFeatureAPI()
      .then((res) => setAIFeature(res.data))
      .catch(handleCatchError);
  };

  const doGetAIFeatureOfPackage = (packageId: string) => {
    getAIFeaturePackageAPI(packageId)
      .then((res: AxiosResponse) => {
        const data = res.data.map((item: any) => ({
          ...item,
          ai_feature: item.ai_feature.id,
          isLimit: !!item.request_limit,
        }));
        setAICloudFeatureGroup(data);
        AICloudFeatureGroupRef.current = [...data];
      })
      .catch(handleCatchError);
  };

  const doUpdateFeatureOfPackage = (id: string, data: Array<AIFeatureItem>) => {
    return updateAIFeatureOfPackageAPI(id, data).then((res) => {
      const data = res.data.map((item: any) => ({
        ...item,
        ai_feature: item.ai_feature.id,
        isLimit: !!item.request_limit,
      }));
      setAICloudFeatureGroup(data);
      AICloudFeatureGroupRef.current = [...data];
    });
  };

  const doCreatePackage = (data: PackageForm) => {
    doCreateAIPackageAPI(data.name)
      .then((res) => doUpdateFeatureOfPackage(res.data.id, data.features))
      .then(() => {
        Alert.success({ title: t('sucess.title'), content: t('action.success') });
        history.goBack();
      })
      .catch(handleCatchError)
      .finally(() => setIsLoading(false));
  };

  const doUpdatePackage = (id: string, data: PackageForm) => {
    doUpdateAIPackageAPI(id, data.name)
      .then((res) => doUpdateFeatureOfPackage(res.data.id, data.features))
      .then(() => {
        Alert.success({ title: t('sucess.title'), content: t('action.success') });
        setIsEdit(false);
      })
      .catch(handleCatchError)
      .finally(() => setIsLoading(false));
  };

  const onAddValid: SubmitHandler<PackageForm> = (data) => {
    setIsLoading(true);
    action === FormAction.UPDATE ? doUpdatePackage(id, data) : doCreatePackage(data);
  };

  const onAddInvalid: SubmitErrorHandler<PackageForm> = (_, event) => {
    event?.target.classList.add('wasvalidated');
  };

  const handleCatchError = (error: AxiosError) => {
    if (error.response?.status === 403) handleErrorNoPermission(error, t);
    else Alert.error({ title: 'Oops!', content: t('error.stWrong') });
  };

  const addFeature = () => {
    AICloudFeatureGroup.push({
      ai_feature: -1,
      limit_type: RequestLimitType.REQUEST,
      request_limit: 0,
      isLimit: false,
    });
    setAICloudFeatureGroup(Array.from(AICloudFeatureGroup));
  };

  const checkDuplicated = (alFeatureItem: AIFeatureItem, position: number): boolean => {
    for (let i = 0; i < position; i++) {
      if (alFeatureItem.ai_feature !== undefined && alFeatureItem.ai_feature === AICloudFeatureGroup[i].ai_feature) {
        alFeatureItem.isDuplicated = true;
        return true;
      }
    }
    alFeatureItem.isDuplicated = false;
    return false;
  };

  const removeFeature = (position: number) => {
    if (AICloudFeatureGroup.length > 1)
      Confirm.delete({
        title: t('cfm.deletePackageFeature.title'),
        content: <>{`${t('cfm.deletePackageFeature.content')}?`}</>,
        onConfirm: () => {
          clearErrors(`features.${position}`);
          AICloudFeatureGroup.splice(position, 1);
          setAICloudFeatureGroup(Array.from(AICloudFeatureGroup));
        },
      });
    else Alert.error({ title: 'Oops!', content: t('error.hasAtLeastOnePackageFeature') });
  };

  const doCancel = () => {
    reset();
    setIsEdit(false);
    setAICloudFeatureGroup(Array.from(AICloudFeatureGroupRef.current));
  };

  useEffect(() => {
    doGetAIFeature();
    if (action === FormAction.CREATE) {
      setIsEdit(true);
      addFeature();
    } else {
      doGetPackage(id);
      doGetAIFeatureOfPackage(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminContentLayout
      activate={PageName.ADMIN_DASHBOARD}
      backTo={`${PageURL.ADMIN}/?tab=ptab`}
      title={initialPackage ? initialPackage.name : t('aipackage.management.add')}
    >
      <Form
        className={`${style.apiKeyForm} ${Object.keys(errors).length !== 0 && 'wasvalidated'}`}
        noValidate
        onSubmit={handleSubmit(onAddValid, onAddInvalid)}
      >
        <h2 className='mb-3'>{t('field.generalInfo')}</h2>
        <Row>
          <Col lg='3' md='6'>
            <Form.Group>
              <Form.Label className='required'>{t('aipackage.name')}</Form.Label>
              <CInput
                name='name'
                disabled={!isEdit}
                placeholder={t('aipackage.hint.packageName')}
                iref={register({
                  required: 'field.error.required',
                  maxLength: 50,
                })}
                valid={!errors.name}
                defaultValue={initialPackage?.name}
              />
              {errors.name?.type === 'required' && <CInputHint>{t(`${errors.name.message}`)}</CInputHint>}
              {errors.name?.type === 'maxLength' && <CInputHint>{`${t('field.error.maxLength')} 50`}</CInputHint>}
            </Form.Group>
          </Col>
        </Row>
        <h2 className='mb-3 mt-4'>{t('aipackage.features')}</h2>
        <div className={style.packageFeatureWrapper}>
          {AICloudFeatureGroup.map((item, index) => (
            <PackageFeatureInfo
              key={index + item.ai_feature}
              aiFeatures={aiFeatures}
              errors={errors}
              isEdit={isEdit}
              packageFeature={item}
              position={index}
              register={register}
              clearErrors={clearErrors}
              unregister={unregister}
              removeFeature={() => removeFeature(index)}
              checkDuplicated={checkDuplicated}
              isLastItem={index === AICloudFeatureGroup.length - 1 && index > 3}
            />
          ))}
        </div>
        {isEdit && (
          <div className={style.addButton} onClick={addFeature}>
            <Image src={PlusIcon} />
            <span className={style.buttonText}>{t('field.addFeature')}</span>
          </div>
        )}
        <div className={style.btnGroup}>
          {!isEdit && action === FormAction.UPDATE ? (
            <CButton type='button' label={t('btn.edit')} onClick={() => setIsEdit(true)} />
          ) : (
            <>
              <CButton
                type='button'
                label={t('btn.cancel')}
                disabled={isLoading}
                variant={ButtonVariant.OUTLINE}
                onClick={() => (action === FormAction.UPDATE ? doCancel() : history.goBack())}
              />
              <CButton type='submit' label={t('btn.save')} disabled={isLoading} loading={isLoading} />
            </>
          )}
        </div>
      </Form>
    </AdminContentLayout>
  );
};

export default AIPackageWriter;
