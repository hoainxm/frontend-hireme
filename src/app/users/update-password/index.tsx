import MainLayout from '@layout/main-layout';
import { ButtonSize, PageName, PageURL } from '@models/enum';
import React, { useRef, useState, useEffect } from 'react';
import style from '../update-password/update-password.module.scss';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import { CInput, CInputHint } from '@base/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PASS_PATTERN } from '../../../common/utils/constants';
import { FormatPasswordRule } from '../../../app/auth/register/FormatPasswordRule';
import CButton from '@base/button';
import { RootState, useAppSelector } from '../../../store/store';
import { UpdatePasswordFormInput } from 'app/auth/forms';
import { updatePassword } from '../api';
import { Alert } from '../../../common/utils/popup';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { message } from 'antd';

export const UpdatePassword = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<UpdatePasswordFormInput>({
    reValidateMode: 'onChange',
  });

  const history = useHistory();

  const userLogin = useAppSelector((state: RootState) => state.user);

  const refPassword = useRef(null);

  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);

  const onSubmit: SubmitHandler<UpdatePasswordFormInput> = async (data) => {
    const { current_password, new_password } = data;

    const token = userLogin.userLogin;
    const email = userLogin.userProfile?.email;

    if (!token) {
      console.error('Token is null or undefined.');
      return;
    }

    if (!email) {
      console.error('Email is null or undefined.');
      return;
    }

    const dataSubmit = {
      token,
      email,
      currentPassword: current_password,
      newPassword: new_password,
    };

    try {
      setOnLoading(true);
      const res = await updatePassword(dataSubmit);

      const responseData = res as any;

      if (responseData && responseData.statusCode === 201) {
        message.success(responseData.data?.message || responseData.message || t('update.pw.success'));
        history.push(PageURL.HOME);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        message.error(error.response.data?.message || t('error.stWrong'));
      } else {
        console.error('Unexpected error:', error);
        message.error(t('error.stWrong'));
      }
    } finally {
      setOnLoading(false);
    }
  };

  const validateCfmPass = (data: string): boolean => data === getValues('new_password');

  const handleFocusPasswordInput = () => setIsPasswordFocused(true);
  const handleBlurPasswordInput = () => setIsPasswordFocused(false);

  const checkShowFormatPassword = (): boolean => {
    const passwordValue = watch('new_password');
    return passwordValue ? isPasswordFocused || errors.new_password?.type === 'pattern' : false;
  };

  return (
    <MainLayout active={PageName.UPDATE_PASSWORD}>
      <section className={style.bannerSection}>
        <div className={style.bannerContainer}>
          <div className={style.top}>
            <h1 className={style.topTitle}>
              {t('user.update-password')}
              <h5>{t('user.update-password.title')}</h5>
            </h1>
          </div>
        </div>
      </section>
      <div className={style['update-password-background']}>
        <div className={style['form-container']}>
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group>
              <Form.Label>{t('field.email')}</Form.Label>
              <CInput
                type='email'
                name='email'
                value={userLogin.userProfile?.email}
                disabled
                readOnly
                style={{ cursor: 'no-drop', userSelect: 'none' }}
              />
            </Form.Group>

            <Form.Group className={style.inputGroup}>
              <Form.Label>{t('field.password.current')}</Form.Label>
              <CInput
                autoComplete='off'
                type='password'
                name='current_password'
                iref={register({ required: 'field.error.required', pattern: PASS_PATTERN })}
                placeholder={t('field.hint.password.current')}
                valid={!errors.current_password}
              />
              {errors.current_password?.type === 'required' && <div className={style['cinput-hint']}>{t(`${errors.current_password.message}`)}</div>}
              {errors.current_password?.type === 'pattern' && <div className={style['cinput-hint']}>{t('field.error.password')}</div>}
            </Form.Group>

            <Form.Group ref={refPassword}>
              <Form.Label>{t('field.newPassword')}</Form.Label>
              <CInput
                id='new_password'
                autoComplete='off'
                type='password'
                name='new_password'
                iref={register({
                  required: 'field.error.required',
                  pattern: PASS_PATTERN,
                })}
                onFocus={handleFocusPasswordInput}
                onBlur={handleBlurPasswordInput}
                placeholder={t('field.hint.newPassword')}
                valid={!errors.new_password}
              />
              {errors.new_password?.type === 'required' && <div className={style['cinput-hint']}>{t(`${errors.new_password.message}`)}</div>}
              {errors.new_password?.type === 'pattern' && <div className={style['cinput-hint']}>{t('field.error.password')}</div>}
            </Form.Group>

            <FormatPasswordRule value={watch('new_password') || ''} target={refPassword} isFocus={checkShowFormatPassword()} />

            <Form.Group>
              <Form.Label>{t('field.cfmNewPassword')}</Form.Label>
              <CInput
                id='confirm_password'
                autoComplete='off'
                type='password'
                name='confirm_password'
                iref={register({
                  required: 'field.error.required',
                  validate: validateCfmPass,
                })}
                placeholder={t('field.cfmNewPassword')}
                valid={!errors.confirm_password}
                maxLength={32}
              />
              {errors.confirm_password?.type === 'required' && <div className={style['cinput-hint']}>{t(`${errors.confirm_password.message}`)}</div>}
              {errors.confirm_password?.type === 'validate' && <div className={style['cinput-hint']}>{t('field.error.confirm_password')}</div>}
            </Form.Group>

            <div className={style['form-container__button']}>
              <CButton type='submit' label={t('btn.save')} loading={onLoading} size={ButtonSize.LARGE} />
            </div>
          </Form>
        </div>
      </div>
    </MainLayout>
  );
};
