import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthFormLayout } from '../shared/AuthFormLayout';
import CButton from '@base/button';
import style from '../auth.module.scss';
import Success from '../../../common/ui/assets/images/Success.svg';
import Error from '../../../common/ui/assets/icon/Error.svg';
import { PageURL } from '@models/enum';
import { doVerifyEmailToken } from '../api';
import { AxiosError } from 'axios';
import { useAppDispatch } from '../../../store/store';
import { logoutThunk } from '../../../store/reducer/userSlice/userThunk';
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
export const VerifyEmail = (): ReactElement => {
  const { t } = useTranslation();
  const history = useHistory();

  const query = useQuery();
  const tokenCheckVerify = query.get('token');
  const [isCheckVerifyEmail, setIsCheckVerifyEmail] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const dispatch = useAppDispatch();
  const redirectToVerifyPage = () => {
    history.push(PageURL.RESEND_VERIFY_EMAIL);
  };

  const redirectToLoginPage = () => {
    history.push(PageURL.LOGIN);
  };

  const checkVerifyEmail = async () => {
    if (tokenCheckVerify) {
      try {
        const res = await doVerifyEmailToken(tokenCheckVerify);
        console.log(res);
        if (res && res.statusCode === 200) {
          setIsCheckVerifyEmail(true);
          await dispatch(logoutThunk());
        }
      } catch (error: AxiosError | any) {
        if (error.response?.status === 400) {
          const dataResponse = error.response.data;
          if (dataResponse.error === 'Bad Request') {
            setErrorMessage(t('error.tokenVerifyInvalid'));
          } else {
            setErrorMessage(t('error.stWrong'));
          }
        }
      }
    }
  };

  useEffect(() => {
    checkVerifyEmail();
  }, []);

  return (
    <>
      {isCheckVerifyEmail ? (
        <AuthFormLayout title={t('emailVerify.success.title')} icon={Success}>
          <div className={style.resetSuccessful}>
            <p>{t('emailVerify.success.first')}</p>
            <p>{t('emailVerify.success.second')}</p>
            <CButton label={t('btn.backToLogin')} className={`${style.btn} mb-0`} onClick={redirectToLoginPage} />
          </div>
        </AuthFormLayout>
      ) : (
        <AuthFormLayout title={t('emailVerify.fail.title')} icon={Error}>
          <div className={style.resetSuccessful}>
            <p>{t('emailVerify.fail.first')}</p>
            <p>{t('emailVerify.fail.second')}</p>
            <CButton label={t('btn.backToVerifyEmail')} className={`${style.btn} mb-0`} onClick={redirectToVerifyPage} />
          </div>
        </AuthFormLayout>
      )}
    </>
  );
};
