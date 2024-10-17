/** @format */

import { CInput, CInputHint } from '../../../common/ui/base/input/index';
import { DEFAULT_PAGE, DEFAULT_PAGE_NUM, EMAIL_PATTERN } from '../../../common/utils/constants';
import { ButtonSize, PageURL, ScopeKey, ScopeValue } from '../../../models/enum';
import React, { FC, useEffect, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { doLogin } from '../api';

import { AuthFormLayout } from '../shared/AuthFormLayout';
import { AxiosError } from 'axios';
import { CButton } from '../../../common/ui/base';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LoginFormInputs } from '../forms';
import { RouteComponentProps } from 'react-router';
import { SVGIcon } from '../../../common/ui/assets/icon';
import style from '../auth.module.scss';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Confirm } from '../../../common/utils/popup';
import e from 'express';

interface Props extends RouteComponentProps<any> {}

const Login: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { state } = useLocation<{ path: string }>();
  const dispatch = useDispatch();
  const { register, errors, handleSubmit, formState } = useForm<LoginFormInputs>();
  const [rememberInfo, setRememberInfo] = useState<boolean>(true);
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [otherError, setOtherError] = useState<string>();
  const [loginError, setLoginError] = useState<string>();

  const [isLogin, setIsLogin] = useState<Boolean>(false);

  const isSysAdminLogin = window.location.pathname.includes('admin');

  const AUTOMATE_MAP: { [key: string]: string } = {
    true: ScopeValue.AUTOMATE,
    false: ScopeValue.NO_AUTOMATE,
  };
  const onRememberInfo = (isChecked: boolean): void => {
    localStorage.setItem(ScopeKey.AUTOMATE_AUTH, AUTOMATE_MAP[`${isChecked}`]);
    setRememberInfo(isChecked);
  };

  const onLoginInvalid: SubmitErrorHandler<LoginFormInputs> = (_, event) => {
    event?.target.classList.add('wasvalidated');
  };

  const onLoginValid: SubmitHandler<LoginFormInputs> = async (data: LoginFormInputs, event) => {
    const requestData = {
      email: data.email || '',
      password: data.password,
    };

    setOnLoad(true);
    // doLogin(requestData)
    //   .catch((e: AxiosError) => {
    //     console.log('check ', e);
    //     // if (e.response?.status === 401) {
    //     //   event?.target.classList.add('wasvalidated');
    //     //   Confirm.danger({
    //     //     title: t('fail.title'),
    //     //     content: t('error.existEmail'),
    //     //   });
    //     // } else {
    //     //   console.log('Error occurred:', e);
    //     // }
    //   })
    //   .then((res) => {
    //     alert(res?.data.message);
    //   })
    //   .finally(() => {
    //     setOnLoad(false);
    //   });

    try {
      const res = await doLogin(requestData);
      if (res && res?.data) {
        alert(res?.data.message);
        setOnLoad(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOnLoad(false);
    }
  };

  useEffect(() => {
    let automate = localStorage.getItem(ScopeKey.AUTOMATE_AUTH);
    if (!automate) {
      automate = ScopeValue.AUTOMATE;
      localStorage.setItem(ScopeKey.AUTOMATE_AUTH, automate);
    }
    setRememberInfo(automate === ScopeValue.AUTOMATE);
  }, []);

  useEffect(() => {
    if (Object.keys(formState.errors).length > 0) {
      setLoginError(undefined);
      setOtherError(undefined);
    }
  }, [formState]);

  return (
    <AuthFormLayout title='auth.login' loginError={loginError} otherError={otherError} hasLanguageDropDown>
      <Form onSubmit={handleSubmit(onLoginValid, onLoginInvalid)} noValidate className={style.form}>
        <Form.Group className={style.inputGroup}>
          <Form.Label>{t('field.email')}</Form.Label>
          <CInput
            type='email'
            name='email'
            placeholder={t('field.hint.email')}
            iref={register({
              required: 'field.error.required',
              pattern: EMAIL_PATTERN,
            })}
            valid={!errors.email}
          />
          {errors.email?.type === 'required' && <CInputHint>{t(`${errors.email.message}`)}</CInputHint>}
          {errors.email?.type === 'pattern' && <CInputHint>{t('field.error.email')}</CInputHint>}
        </Form.Group>

        <Form.Group className={style.inputGroup}>
          <Form.Label>{t('field.password')}</Form.Label>
          <CInput
            autoComplete='off'
            type='password'
            name='password'
            iref={register({ required: 'field.error.required' })}
            placeholder={t('field.hint.password')}
            valid={!errors.password}
          />
          {errors.password && <CInputHint>{t(`${errors.password.message}`)}</CInputHint>}
        </Form.Group>
        <div className={style.remember}>
          <Form.Check
            custom
            checked={rememberInfo}
            onChange={(e) => onRememberInfo(e.currentTarget.checked)}
            type='checkbox'
            id='rmb-info'
            label={t('auth.rmbInfo')}
          />
          <Link to={PageURL.FORGOT_PASSWORD}>{t('auth.forgotPass')}?</Link>
        </div>
        <CButton type='submit' label={t('auth.login')} loading={onLoad} disabled={onLoad} size={ButtonSize.LARGE} className={style.btn} />
        {!isSysAdminLogin && (
          <>
            <div className={style.alternative}>
              <div></div>
              <p>{t('auth.alternative')}</p>
              <div></div>
            </div>
            <div className={style.btnSocialGroup}>
              <button type='button'>
                <SVGIcon icon='GoogleFill' size={24} />
                Google
              </button>
            </div>
            <div className={style.redirect}>
              <p>{t('auth.noAccount')} </p>
              <Link to={PageURL.REGISTER}>{t('auth.registerNow')}</Link>
            </div>
          </>
        )}
      </Form>
    </AuthFormLayout>
  );
};

export default Login;
