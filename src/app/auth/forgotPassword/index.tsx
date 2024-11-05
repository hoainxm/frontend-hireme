import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { AuthFormLayout } from '../shared/AuthFormLayout';
import { Form } from 'react-bootstrap';
import style from '../auth.module.scss';
import { useTranslation } from 'react-i18next';
import { CButton, CInput, CInputHint } from '../../../common/ui/base';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { ForgotPasswordFormInputs } from '../forms';
import { COUNT_DOWN, EMAIL_PATTERN } from '../../../common/utils/constants';
import { PageURL } from '../../../models/enum';
import { forgotPassword, generateTokenResetPassword } from '../api';
import { AxiosError } from 'axios';
import useCountDown from '../../../common/utils/hooks/useCountDown';

export const ForgotPassword = (): ReactElement => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormInputs>();
  const { count, startCountdown } = useCountDown();

  const formRef = useRef<HTMLFormElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>();

  const onValid: SubmitHandler<ForgotPasswordFormInputs> = async (data, event) => {
    try {
      await forgotPassword(data);
      startCountdown(COUNT_DOWN.FORGOT_PASSWORD);
    } catch (error: AxiosError | any) {
      if (error.response?.status === 400 && error.response.data.message === 'User not found.') {
        setErrorMessage(t('emailVerify.user.error'));
      } else {
        setErrorMessage(t('emailVerify.resend.error'));
      }
    }
  };

  const onInvalid: SubmitErrorHandler<ForgotPasswordFormInputs> = (_, event) => {
    event?.target.classList.add('wasvalidated');
  };

  const checkCountDown = (): string => {
    return count > 0 ? `${t('auth.getLink')} (${t('count.afterCount', { value: count })})` : t('auth.getLink');
  };

  return (
    <AuthFormLayout title='auth.forgotPass' subTitle='auth.forgotPass.subTitle' backTo={PageURL.LOGIN} hasLanguageDropDown>
      <Form onSubmit={handleSubmit(onValid, onInvalid)} noValidate ref={formRef} className={style.form}>
        <Form.Group className={style.inputGroup}>
          <Form.Label className='required'>{t('field.email')}</Form.Label>
          <CInput
            type='email'
            name='email'
            placeholder={t('field.hint.email')}
            iref={register({
              required: 'field.error.required',
              pattern: EMAIL_PATTERN,
            })}
            valid={!errors.email && !errorMessage}
          />
          {errors.email?.type === 'required' && <CInputHint>{t(`${errors.email.message}`)}</CInputHint>}
          {errors.email?.type === 'pattern' && <CInputHint>{t('field.error.email')}</CInputHint>}
          {errorMessage && <CInputHint>{t(errorMessage)}</CInputHint>}
        </Form.Group>
        <CButton type='submit' label={checkCountDown()} className={`${style.btn} mb-0`} disabled={isSubmitting || count > 0} loading={isSubmitting} />
      </Form>
    </AuthFormLayout>
  );
};
