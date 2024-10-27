/** @format */

import { CInput, CInputHint } from '../../../common/ui/base/input/index';
import { EMAIL_PATTERN, PASS_PATTERN } from '../../../common/utils/constants';
import { ButtonSize, PageURL, ScopeKey, ScopeValue } from '../../../models/enum';
import React, { FC, useEffect, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { doLogin } from '../api';

import { AuthFormLayout } from '../shared/AuthFormLayout';
import { CButton } from '../../../common/ui/base';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LoginFormInputs } from '../forms';
import { RouteComponentProps, useHistory } from 'react-router';
import { SVGIcon } from '../../../common/ui/assets/icon';
import style from '../auth.module.scss';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState, useAppDispatch, useAppSelector } from '../../../store/store';
import { getUserProfileThunk, loginThunk } from '../../../store/reducer/userSlice/userThunk';
import { Alert } from '../../../common/utils/popup';

interface Props extends RouteComponentProps<any> {}

const Login: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { state } = useLocation<{ path: string }>();
  const history = useHistory();
  const { register, errors, handleSubmit, formState } = useForm<LoginFormInputs>();

  const [otherError, setOtherError] = useState<string>();
  const [loginError, setLoginError] = useState<string>();

  const isSysAdminLogin = window.location.pathname.includes('admin');

  const onLoginInvalid: SubmitErrorHandler<LoginFormInputs> = (_, event) => {
    event?.target.classList.add('wasvalidated');
  };

  const handleLoginGoogle = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/v1/auth/google`;
  };

  const redirectToHome = () => {
    history.push(PageURL.HOME);
  };

  const dispatch = useAppDispatch();
  const { isFetchingLogin, userLogin } = useAppSelector((state: RootState) => state.user);

  if (userLogin) {
    redirectToHome();
  }

  const onLoginValid: SubmitHandler<LoginFormInputs> = async (data: LoginFormInputs, event) => {
    const requestData = {
      email: data.email,
      password: data.password,
    };

    try {
      await Promise.all([dispatch(loginThunk(requestData)).unwrap(), dispatch(getUserProfileThunk()).unwrap()]);
      redirectToHome();
    } catch (error) {
      console.error('Login fail: ', error);
    }
  };

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
            iref={register({ required: 'field.error.required', pattern: PASS_PATTERN })}
            placeholder={t('field.hint.password')}
            valid={!errors.password}
          />
          {errors.password?.type === 'required' && <CInputHint>{t(`${errors.password.message}`)}</CInputHint>}
          {errors.password?.type === 'pattern' && <CInputHint>{t('field.error.password')}</CInputHint>}
        </Form.Group>

        <CButton
          type='submit'
          label={t('auth.login')}
          loading={isFetchingLogin}
          disabled={isFetchingLogin}
          size={ButtonSize.LARGE}
          className={style.btn}
        />
        {!isSysAdminLogin && (
          <>
            <div className={style.alternative}>
              <div></div>
              <p>{t('auth.alternative')}</p>
              <div></div>
            </div>
            <div className={style.btnSocialGroup} onClick={handleLoginGoogle}>
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
