/** @format */

import { CInput, CInputHint } from '../../../common/ui/base/input/index';
import { DEFAULT_PAGE, DEFAULT_PAGE_NUM, EMAIL_PATTERN } from '../../../common/utils/constants';
import { ButtonSize, PageURL, ScopeKey, ScopeValue } from '../../../models/enum';
import React, { FC, useEffect, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { doAdminLogin, loginApi } from '../api';

import { AuthFormLayout } from '../shared/AuthFormLayout';
import { AxiosError } from 'axios';
import { CButton } from '../../../common/ui/base';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LoginFormInputs } from '../forms';
import { RouteComponentProps } from 'react-router';
import { SVGIcon } from '../../../common/ui/assets/icon';
import { UserProfile } from '../models';
import { encodeBase64 } from '../../../common/utils/common';
import { getProfile } from '../../../common/ui/layout/api';
import style from '../auth.module.scss';
import { updateUserInfo } from '../../../common/ui/layout/slice';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { doPost } from 'common/utils/baseAPI';
import { response } from 'express';

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
      // username: isSysAdminLogin ? data.username : data.email,
      email: data.email || '',
      // tenant_alias: data.email || '',
      password: data.password,
    };

    setOnLoad(true);
    const loginFunc = isSysAdminLogin ? doAdminLogin : loginApi;
    loginFunc(requestData)
      .then((res) => {
        if (!rememberInfo) {
          sessionStorage.setItem(ScopeKey.ACCESS_TOKEN, encodeBase64(res.data['access']));
        }
        // localStorage.setItem(ScopeKey.AUTOMATE_AUTH, AUTOMATE_MAP[`${rememberInfo}`]);
        // localStorage.setItem(ScopeKey.IS_AUTHENTICATED, ScopeValue.TRUE);
        // localStorage.setItem('pageTable', JSON.stringify(DEFAULT_PAGE));
        // localStorage.setItem('pageNumTable', JSON.stringify(DEFAULT_PAGE_NUM));

        getProfile()
          .then((res) => {
            const profileData: UserProfile = res.data;

            // localStorage.setItem(ScopeKey.IS_SYSTEM_ADMIN, profileData.is_superuser ? ScopeValue.TRUE : ScopeValue.FALSE);

            localStorage.removeItem(ScopeKey.USER);
            dispatch(updateUserInfo(profileData));
            const page = profileData.is_superuser ? PageURL.ADMIN : state ? state.path : PageURL.HOME;
            !profileData.is_superuser && profileData.is_reset_password
              ? props.history.push(PageURL.RESET_PASSWORD)
              : (window.location.href = `${window.location.origin}${page}`);
          })
          .catch((e: AxiosError) => {
            setOnLoad(false);
            props.history.push(PageURL.LOGIN);
          });
      })
      .catch((e: AxiosError) => {
        event?.target.classList.add('wasvalidated');
        if (e.response?.status === 400) {
          setOtherError(undefined);
          setLoginError(isSysAdminLogin ? 'error.adminLoginInvalid' : 'error.userLoginInvalid');
        } else if (e.response?.status === 403) {
          if (e.response?.data.msg) {
            setLoginError(undefined);
            setOtherError('error.permission');
          }
        } else {
          setOtherError(undefined);
          setLoginError('error.stWrong');
        }
      })
      .finally(() => {
        setOnLoad(false);
      });

    const loginData = {
      email: data.email,
      password: data.password,
    };

    setOnLoad(true);
    try {
      const res = await loginApi(loginData);
      if (res && res.data) {
        alert(res.data.message);
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
