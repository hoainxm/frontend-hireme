/** @format */

import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import AdminContentLayout from '../../../common/ui/layout/admin-content-layout';
import { ButtonVariant, PageName } from '../../../models/enum';
import { Form } from 'react-bootstrap';
import style from './welcomeInform.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CInputHint, ImportImage, CButton } from '../../../common/ui/base';
import EditWelcomeInform from './EditWelcomeInform';
import DefaultLogo from '../../../common/ui/assets/ic/150px/avatar.svg';
import ZaloCode from '../../../common/ui/assets/ic/ZaloCode.svg';
import { EditWelcomeInformForm } from '../form';
import { doCreateWelcomeInfo, doGetWelcomeInfo, doUpdateWelcomeInfo } from '../../../common/ui/layout/api';
import { Alert } from '../../../common/utils/popup';
import useLoginSessionError from '../../../common/utils/hooks/useLoginSessionError';

interface Props extends RouteComponentProps {}

const WelcomeInformation: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { handleSubmit, register, errors, getValues, setValue, clearErrors } = useForm();
  const handlerSessionError = useLoginSessionError();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#ffffff');
  const [initial, setInitial] = useState<EditWelcomeInformForm>();
  const [previewImage, setPreviewImage] = useState<string>(DefaultLogo);
  const [previewSmallLogo, setPreviewSmallLogo] = useState<string>(DefaultLogo);
  const [previewZaloLogo, setPreviewZaloLogo] = useState<string>(ZaloCode);
  const [isHasImg, setIsHasImg] = useState<boolean>(true);

  const primaryLogoRef = useRef<string>(DefaultLogo);
  const secondLogoRef = useRef<string>(DefaultLogo);
  const zaloLogoRef = useRef<string>(ZaloCode);

  const onValid: SubmitHandler<EditWelcomeInformForm> = (data: EditWelcomeInformForm) => {
    const dataForm = new FormData();
    dataForm.append('primary_name', data.primary_name);
    dataForm.append('address', data.address);
    !(initial && getValues('primary_logo').length === 0) && data.primary_logo.length > 0 && dataForm.append('primary_logo', data.primary_logo[0]);
    dataForm.append('email', data.email);
    dataForm.append('phone_detail', data.phone_detail);
    dataForm.append('background', data.background);
    data.secondary_logo.length > 0 && dataForm.append('secondary_logo', data.secondary_logo[0]);
    data.zalo_logo.length > 0 && dataForm.append('zalo_logo', data.zalo_logo[0]);

    if (initial) {
      setIsHasImg(true);
      initial.id && updateWelcomeInfo(initial.id, dataForm);
    } else {
      data.primary_logo.length === 0 ? setIsHasImg(false) : setIsHasImg(true);
      data.primary_logo.length !== 0 && createWelcomeInfo(dataForm);
    }
  };

  const updateWelcomeInfo = (id: number, dataForm: FormData) => {
    doUpdateWelcomeInfo(id, dataForm)
      .then(() => {
        setIsEdit(false);
        Alert.success({ title: t('sucess.title'), content: t('welcome.hint.modifySuccess') });
      })
      .catch(handlerSessionError.adminSession);
  };

  const createWelcomeInfo = (dataForm: FormData) => {
    doCreateWelcomeInfo(dataForm)
      .then(() => {
        setIsEdit(false);
        Alert.success({ title: t('sucess.title'), content: t('welcome.hint.addSuccess') });
      })
      .catch(handlerSessionError.adminSession);
  };

  const doResetData = () => {
    initial?.background && setColor(initial.background);
    setPreviewImage(primaryLogoRef.current);
    setPreviewSmallLogo(secondLogoRef.current);
    setPreviewZaloLogo(zaloLogoRef.current);
    setValue('primary_name', initial?.primary_name);
    setValue('address', initial?.address);
    setValue('email', initial?.email);
    setValue('phone_detail', initial?.phone_detail);
    setIsEdit(false);
    clearErrors();
  };

  const getInitial = () => {
    doGetWelcomeInfo()
      .then((res) => {
        if (res.data.length > 0) {
          setInitial(res.data[0]);
          primaryLogoRef.current = res.data[0]?.primary_logo;
          secondLogoRef.current = res.data[0]?.secondary_logo;
          zaloLogoRef.current = res.data[0]?.zalo_logo;
          setPreviewImage(primaryLogoRef.current);
          setPreviewSmallLogo(secondLogoRef.current);
          setPreviewZaloLogo(zaloLogoRef.current);
        }
      })
      .catch(() => Alert.error({ title: 'Oops!', content: t('error.stWrong') }));
  };

  useEffect(() => {
    initial?.background && setColor(initial.background);
  }, [initial]);

  useEffect(() => {
    getInitial();
    // eslint-disable-next-line
  }, []);

  return (
    <AdminContentLayout title={t(PageName.WELCOME_INFORM_MANAGEMENT)} activate={PageName.WELCOME_INFORM_MANAGEMENT}>
      <Form onSubmit={handleSubmit(onValid)} className={`${style.container} ${Object.keys(errors).length !== 0 && 'wasvalidated'}`} noValidate>
        <div className='d-flex'>
          <div className='d-flex align-items-center mr-5'>
            <div className='d-flex flex-column align-items-center '>
              <Form.Label className='mb-1'>{t('welcome.mainLogo')}</Form.Label>
              <ImportImage
                previewImgClassName={style.previewImg}
                defaultImage={previewImage}
                setDefaultImage={setPreviewImage}
                width={110}
                height={110}
                name='primary_logo'
                register={register()}
                disabled={!isEdit}
                isHide={!isEdit}
                widthButton={15}
                heightButton={15}
                className={style.blueBorder}
              />

              {!isHasImg && <CInputHint className={'validated text-center'}>{t('field.error.avatar')}</CInputHint>}
              <div className='d-flex'>
                <div className='mr-4'>
                  <Form.Label className='mb-1 mt-3'>{t('welcome.secondaryLogo')}</Form.Label>
                  <ImportImage
                    previewImgClassName={style.previewImg}
                    defaultImage={previewSmallLogo}
                    setDefaultImage={setPreviewSmallLogo}
                    width={110}
                    height={75}
                    className={`${style.blueBorder} mt-2`}
                    name='secondary_logo'
                    register={register()}
                    disabled={!isEdit}
                    isHide={!isEdit}
                    widthButton={15}
                    heightButton={15}
                  />
                </div>
                <div>
                  <Form.Label className='mb-1 mt-3'>Zalo</Form.Label>
                  <ImportImage
                    previewImgClassName={style.previewImg}
                    defaultImage={previewZaloLogo}
                    setDefaultImage={setPreviewZaloLogo}
                    width={110}
                    height={75}
                    className={`${style.blueBorder} mt-2`}
                    name='zalo_logo'
                    register={register()}
                    disabled={!isEdit}
                    isHide={!isEdit}
                    widthButton={15}
                    heightButton={15}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='flex-grow-1'>
            <EditWelcomeInform
              initial={initial}
              errors={errors}
              color={color}
              setColor={(color) => setColor(color)}
              register={register}
              isEdit={isEdit}
            />
          </div>
        </div>
        <div className='d-flex justify-content-end mt-5'>
          {!isEdit ? (
            <CButton type='button' className={'d-flex'} label={t('btn.edit')} onClick={() => setIsEdit(true)} />
          ) : (
            <div className='d-flex'>
              <CButton
                type='button'
                className='mr-3'
                label={t('btn.cancel')}
                variant={ButtonVariant.OUTLINE}
                onClick={() => {
                  doResetData();
                }}
              />
              <CButton type='submit' label={t('btn.save')} />
            </div>
          )}
        </div>
      </Form>
    </AdminContentLayout>
  );
};

export default WelcomeInformation;
