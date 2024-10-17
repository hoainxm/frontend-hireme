import React, { ReactElement, useEffect, useState } from 'react';
import { AuthFormLayout } from '../shared/AuthFormLayout';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
<<<<<<< HEAD:src/app/auth/email-verify/index.tsx
import { doReSendVerifyEmail, doVerifyEmailToken } from '../api'; // Import các hàm API đã sửa
=======
import { doReSendVerifyEmail, doVerifyEmailToken } from '../api';
>>>>>>> a8489aa79bfdf2041cadbc8995a6f73e88516b9f:src/app/auth/resend-verify-email/index.tsx
import { EmailVerifyFormInputs } from '../forms';
import { PageURL } from '../../../models/enum';
import style from '../auth.module.scss';
import { CButton, CInput, CInputHint } from '../../../common/ui/base';
import Success from '../../../common/ui/assets/images/Success.svg';
import { COUNT_DOWN, EMAIL_PATTERN } from '../../../common/utils/constants';
import useCountDown from '../../../common/utils/hooks/useCountDown';
import { AxiosError } from 'axios';

// Hook để lấy query params từ URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const ResendVerifyEmail = (): ReactElement => {
  const { t } = useTranslation();
  const history = useHistory();
  const { count, startCountdown } = useCountDown();
  const query = useQuery(); // Lấy query params từ URL

<<<<<<< HEAD:src/app/auth/email-verify/index.tsx
  const tokenCheckVerify = query.get('token'); // Lấy token từ query params
  const emailFromURL = query.get('email'); // Lấy email từ query params

  // Giải mã email bị mã hóa URL
  const decodedEmail = emailFromURL ? decodeURIComponent(emailFromURL) : '';

=======
>>>>>>> a8489aa79bfdf2041cadbc8995a6f73e88516b9f:src/app/auth/resend-verify-email/index.tsx
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<EmailVerifyFormInputs>();
  const [errorMessage, setErrorMessage] = useState<string>();
<<<<<<< HEAD:src/app/auth/email-verify/index.tsx
  const [isVerifiedSuccessfully, setIsVerifiedSuccessfully] = useState<boolean>(false);
  const [resendEmail, setResendEmail] = useState<string>(decodedEmail); // Sử dụng email giải mã

  // Điều hướng đến trang đăng nhập
  const redirectToLoginPage = () => {
    history.push(PageURL.LOGIN);
  };
=======
  const [resendEmail, setResendEmail] = useState<string>('');
>>>>>>> a8489aa79bfdf2041cadbc8995a6f73e88516b9f:src/app/auth/resend-verify-email/index.tsx

  // Gửi yêu cầu API để gửi lại email xác thực (qua body)
  const handleResendVerifyEmail: SubmitHandler<EmailVerifyFormInputs> = async (data) => {
    setErrorMessage('');
    try {
      await doReSendVerifyEmail(data); // Gửi email qua body
      setErrorMessage(t('emailVerify.resend.success'));
      startCountdown(COUNT_DOWN.RESEND_EMAIL);
    } catch (error: AxiosError | any) {
      if (error.response?.status === 400 && error.response.data.message === 'User not found.') {
        setErrorMessage('Email không tồn tại trong hệ thống.');
      } else {
        setErrorMessage(t('emailVerify.resend.error'));
      }
    }
  };

<<<<<<< HEAD:src/app/auth/email-verify/index.tsx
  // Hàm xác minh email bằng token từ URL
  const verifyEmail = async () => {
    if (tokenCheckVerify) {
      try {
        await doVerifyEmailToken(tokenCheckVerify); // Gửi token qua params
        setIsVerifiedSuccessfully(true); // Xác minh thành công
      } catch (error: AxiosError | any) {
        if (error.response?.status === 400) {
          const dataResponse = error.response.data;
          if (dataResponse.msg === 'Verification token invalid') {
            setErrorMessage(t('error.tokenInvalid'));
          } else {
            setErrorMessage(t('error.stWrong'));
          }
        }
      }
    } else {
      setErrorMessage(t('emailVerify.verify.error'));
    }
  };

  // Xác minh email khi component được tải lần đầu tiên
  useEffect(() => {
    verifyEmail(); // Xác minh email qua token từ URL
  }, [tokenCheckVerify]);

  // Tính toán nhãn cho nút đếm ngược
=======
>>>>>>> a8489aa79bfdf2041cadbc8995a6f73e88516b9f:src/app/auth/resend-verify-email/index.tsx
  const checkCountDown = (): string => {
    return count > 0 ? `${t('btn.resendVerify')} (${t('count.afterCount', { value: count })})` : t('btn.resendVerify');
  };

<<<<<<< HEAD:src/app/auth/email-verify/index.tsx
  // Giao diện khi email đã được xác minh thành công
  if (isVerifiedSuccessfully) {
    return (
      <AuthFormLayout title={t('emailVerify.success.title')} icon={Success}>
        <div className={style.resetSuccessful}>
          <p>{t('emailVerify.success.first')}</p>
          <p>{t('emailVerify.success.second')}</p>
          <CButton label={t('btn.backToLogin')} className={`${style.btn} mb-0`} onClick={redirectToLoginPage} />
        </div>
      </AuthFormLayout>
    );
  }

  // Giao diện để nhập email và yêu cầu gửi lại email xác thực
=======
>>>>>>> a8489aa79bfdf2041cadbc8995a6f73e88516b9f:src/app/auth/resend-verify-email/index.tsx
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
