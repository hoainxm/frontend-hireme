import React, { FC, useEffect, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { AuthFormLayout } from '../shared/AuthFormLayout';
import { CInput, CInputHint } from '../../../common/ui/base/input/index';
import { CButton } from '../../../common/ui/base';
import { EMAIL_PATTERN, PASS_PATTERN } from '../../../common/utils/constants';
import { Form } from 'react-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { LoginFormInputs } from '../forms';
import { RootState, useAppDispatch, useAppSelector } from '../../../store/store';
import { getUserProfileThunk, loginThunk } from '../../../store/reducer/userSlice/userThunk';
import { PageURL, ButtonSize } from '../../../models/enum';
import style from '../auth.module.scss';
import { SVGIcon } from '../../../common/ui/assets/icon';
import { useTranslation } from 'react-i18next';

const Login: FC = () => {
  const { t } = useTranslation();
  const { state } = useLocation<{ path: string }>();
  const history = useHistory();
  const { register, errors, handleSubmit, formState } = useForm<LoginFormInputs>();

  const [loginError, setLoginError] = useState<string>();

  const dispatch = useAppDispatch();
  const { isFetchingLogin, userLogin } = useAppSelector((state: RootState) => state.user);

  if (userLogin) {
    history.push(PageURL.HOME);
  }

  const onLoginInvalid: SubmitErrorHandler<LoginFormInputs> = (_, event) => {
    event?.target.classList.add('wasvalidated');
  };

  const onLoginValid: SubmitHandler<LoginFormInputs> = async (data: LoginFormInputs) => {
    try {
      await dispatch(loginThunk(data)).unwrap();
      await dispatch(getUserProfileThunk()).unwrap();
      history.push(PageURL.HOME);
    } catch (error) {
      setLoginError(t('auth.loginError'));
    }
  };

  useEffect(() => {
    if (Object.keys(formState.errors).length > 0) {
      setLoginError(undefined);
    }
  }, [formState]);

  return (
    <AuthFormLayout title='auth.login' loginError={loginError} hasLanguageDropDown>
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

        {loginError && <div className={style.errorMessage}>{loginError}</div>}
        <div className={style.forgotPassword}>
          <Link to={PageURL.FORGOT_PASSWORD}>{t('auth.forgotPass')}?</Link>
        </div>
        <CButton
          type='submit'
          label={t('auth.login')}
          loading={isFetchingLogin}
          disabled={isFetchingLogin}
          size={ButtonSize.LARGE}
          className={style.btn}
        />
        <div className={style.alternative}>
          <div></div>
          <p>{t('auth.alternative')}</p>
          <div></div>
        </div>
        <div className={style.btnSocialGroup}>
          <button type='button' onClick={() => (window.location.href = `${process.env.REACT_APP_API_URL}/api/v1/auth/google`)}>
            <SVGIcon icon='GoogleFill' size={24} />
            Google
          </button>
        </div>
        <div className={style.redirect}>
          <p>{t('auth.noAccount')}</p>
          <Link to={PageURL.REGISTER}>{t('auth.registerNow')}</Link>
        </div>
      </Form>
    </AuthFormLayout>
  );
};

export default Login;
