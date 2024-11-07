import React, { ReactElement, useEffect, useState } from 'react';
import { AuthFormLayout } from '../shared/AuthFormLayout';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { doReSendVerifyEmail, doVerifyEmailToken } from '../api';
import { EmailVerifyFormInputs } from '../forms';
import { PageURL } from '../../../models/enum';
import style from '../auth.module.scss';
import { CButton, CInput, CInputHint } from '../../../common/ui/base';
import Success from '../../../common/ui/assets/images/Success.svg';
import { COUNT_DOWN, EMAIL_PATTERN } from '../../../common/utils/constants';
import useCountDown from '../../../common/utils/hooks/useCountDown';
import { AxiosError } from 'axios';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const ResendVerifyEmail = (): ReactElement => {
  const { t } = useTranslation();
  const history = useHistory();
  const { count, startCountdown } = useCountDown();
  const query = useQuery();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<EmailVerifyFormInputs>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [resendEmail, setResendEmail] = useState<string>('');

  const handleResendVerifyEmail: SubmitHandler<EmailVerifyFormInputs> = async (data) => {
    setErrorMessage('');
    try {
      await doReSendVerifyEmail(data);
      setErrorMessage(t('emailVerify.resend.success'));
      startCountdown(COUNT_DOWN.RESEND_EMAIL);
    } catch (error: AxiosError | any) {
      if (error.response?.status === 400 && error.response.data.message === 'User not found.') {
        setErrorMessage(t('emailVerify.user.error'));
      } else {
        // setErrorMessage(t('emailVerify.resend.error'));
        setErrorMessage(error.response.data.message);
      }
    }
  };

  const checkCountDown = (): string => {
    return count > 0 ? `${t('btn.resendVerify')} (${t('count.afterCount', { value: count })})` : t('btn.resendVerify');
  };

  return (
    <AuthFormLayout title={t('emailVerify.title')} subTitle={t('emailVerify.subtitle')} backTo={PageURL.LOGIN} hasLanguageDropDown>
      <Form onSubmit={handleSubmit(handleResendVerifyEmail)} noValidate className={style.form}>
        <Form.Group className={style.inputGroup}>
          <Form.Label className='required'>{t('field.email')}</Form.Label>
          <CInput
            autoComplete='off'
            type='email'
            name='email'
            placeholder={t('field.hint.email')}
            iref={register({
              required: t('field.error.required'),
              pattern: {
                value: EMAIL_PATTERN,
                message: t('field.error.email'),
              },
            })}
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            valid={!errors.email && !errorMessage}
          />
          {errors.email && <CInputHint className={style.errorMessage}>{t(`${errors.email.message}`)}</CInputHint>}
          {errorMessage && <CInputHint className={style.errorMessage}>{t(errorMessage)}</CInputHint>}
        </Form.Group>
        <CButton type='submit' label={checkCountDown()} className={`${style.btn} mb-0`} disabled={count > 0 || isSubmitting} loading={isSubmitting} />
      </Form>
    </AuthFormLayout>
  );
};
