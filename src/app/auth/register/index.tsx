/** @format */

import { CButton, CInput, CInputHint } from '../../../common/ui/base';
import { Col, Form } from 'react-bootstrap';
import { EMAIL_PATTERN, NORMAL_CHAR_PATTERN, PASS_PATTERN } from '../../../common/utils/constants';
import { Link, useHistory } from 'react-router-dom';
import React, { FC, useRef, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { AuthFormLayout } from '../shared/AuthFormLayout';
import { AxiosError } from 'axios';
import { Confirm } from '../../../common/utils/popup';
import { FormatPasswordRule } from './FormatPasswordRule';
import { ButtonSize, PageURL } from '../../../models/enum';
import { RegisterFormInputs } from '../forms';
import { doRegister } from '../api';
import style from '../auth.module.scss';

interface Props {}

interface FormError {
  [key: string]: boolean;
  email: boolean;
  confirm_password: boolean;
}

const Register: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { errors, handleSubmit, getValues, register, watch } = useForm<RegisterFormInputs>({
    reValidateMode: 'onChange',
  });
  const history = useHistory();

  const refPassword = useRef(null);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [errorState, setErrorState] = useState<FormError>({
    email: false,
    confirm_password: false,
  });

  const [onLoad, setOnLoad] = useState<boolean>(false);

  const onRegisValid: SubmitHandler<RegisterFormInputs> = async (data, event) => {
    const { confirm_password, ...filteredData } = data;

    const redirectToHome = () => {
      history.push(PageURL.HOME);
    };

    setOnLoad(true);
    doRegister(filteredData)
      .then((res) => {
        Confirm.success({
          title: t('sucess.title'),
          content: t('auth.signupSuccess'),
          onConfirm: () => history.push(PageURL.LOGIN),
        });
        setErrorMsg('');
        Object.keys(errorState).forEach((errorKey) => {
          errorState[errorKey] = false;
        });
        event?.target.reset();
      })
      .catch((e: AxiosError) => {
        if (e.response?.status === 400) {
          event?.target.classList.add('wasvalidated');
          const dataRes = e.response.data;
          Confirm.danger({
            title: t('fail.title'),
            content: t('error.existEmail'),
            onCancel() {
              redirectToHome();
            },
          });
          Object.keys(errorState).forEach((errorKey) => {
            if (errorKey in dataRes) {
              errorState[errorKey] = true;
            } else {
              errorState[errorKey] = false;
            }
          });
          setErrorState(Object.assign({}, errorState));
        } else {
          setErrorMsg('error.stWrong');
        }
      })
      .finally(() => {
        setOnLoad(false);
      });
  };

  const onRegisInvalid: SubmitErrorHandler<RegisterFormInputs> = (_, event) => {
    event?.target.classList.add('wasvalidated');
  };

  const validateCfmPass = (data: string): boolean => {
    return data === getValues('password');
  };

  const handleFocusPasswordInput = () => {
    setIsPasswordFocused(true);
  };

  const handleBlurPasswordInput = () => {
    setIsPasswordFocused(false);
  };

  const checkShowFormatPassword = (): boolean => {
    const passwordValue = watch('password');
    if (!passwordValue) return false;
    return isPasswordFocused || errors.password?.type === 'pattern';
  };

  return (
    <AuthFormLayout title='auth.register' hasLanguageDropDown loginError={errorMsg} otherError={errorState.email ? 'error.emailExists' : ''}>
      <Form onSubmit={handleSubmit(onRegisValid, onRegisInvalid)} noValidate className={style.form}>
        <Form.Group className={style.inputGroup}>
          <Form.Label>{t('field.fullName')}</Form.Label>
          <CInput
            type='text'
            name='name'
            placeholder={t('field.hint.fullName')}
            iref={register({
              required: 'field.error.required',
              pattern: NORMAL_CHAR_PATTERN,
              maxLength: 200,
            })}
            valid={!errors.name}
          />
          {errors.name?.type === 'required' && <CInputHint>{t(`${errors.name.message}`)}</CInputHint>}
          {errors.name?.type === 'pattern' && <CInputHint>{t('field.error.character')}</CInputHint>}
          {errors.name?.type === 'maxLength' && <CInputHint>{`${t('field.error.maxLength')} 200`}</CInputHint>}
        </Form.Group>

        <Form.Group className={style.inputGroup}>
          <Form.Label>{t('field.email')}</Form.Label>
          <CInput
            type='email'
            name='email'
            placeholder={t('field.hint.email')}
            iref={register({
              required: 'field.error.required',
              pattern: EMAIL_PATTERN,
              maxLength: 200,
            })}
            valid={!errors.email && !errorState.email}
          />
          {errors.email?.type === 'required' && <CInputHint>{t(`${errors.email.message}`)}</CInputHint>}
          {errors.email?.type === 'pattern' && <CInputHint>{t('field.error.email')}</CInputHint>}
          {errors.email?.type === 'maxLength' && <CInputHint>{`${t('field.error.maxLength')} 200`}</CInputHint>}
        </Form.Group>
        <Form.Group className={style.inputGroup} ref={refPassword}>
          <Form.Label>{t('field.password')}</Form.Label>
          <CInput
            id='password'
            autoComplete='off'
            type='password'
            name='password'
            iref={register({
              required: 'field.error.required',
              pattern: PASS_PATTERN,
            })}
            onFocus={handleFocusPasswordInput}
            onBlur={handleBlurPasswordInput}
            placeholder={t('field.hint.password')}
            valid={!errors.password}
          />
          {errors.password?.type === 'required' && <CInputHint>{t(`${errors.password.message}`)}</CInputHint>}
        </Form.Group>

        <FormatPasswordRule value={watch('password') || ''} target={refPassword} isFocus={checkShowFormatPassword()} />

        <Form.Group className={style.inputGroup}>
          <Form.Label>{t('field.cfmPassword')}</Form.Label>
          <CInput
            id='confirm_password'
            autoComplete='off'
            type='password'
            name='confirm_password'
            iref={register({
              required: 'field.error.required',
              validate: (data) => validateCfmPass(data),
            })}
            placeholder={t('field.cfmPassword')}
            valid={!errors.confirm_password && !errorState.confirm_password}
            maxLength={32}
          />
          {errors.confirm_password?.type === 'required' && <CInputHint>{t(`${errors.confirm_password.message}`)}</CInputHint>}
          {errors.confirm_password?.type === 'validate' && <CInputHint>{t('field.error.confirm_password')}</CInputHint>}
          {errorState.confirm_password && <CInputHint>{t('error.cfmPass')}</CInputHint>}
        </Form.Group>

<<<<<<< HEAD
        <Form.Group className={style.inputGroup}>
          <Form.Label>{t('field.birthday')}</Form.Label>
          <CInput
            id='birthday'
            type='date'
            name='birthday'
            iref={register({
              required: 'field.error.required',
            })}
            placeholder={t('field.hint.birthday')}
          />
        </Form.Group>

        <Form.Group className={style.inputGroup}>
          <Form.Label>{t('field.gender')}</Form.Label>
          <Form.Control
            as='select'
            name='gender'
            ref={register({
              required: 'field.error.required',
            })}
            isValid={!errors.gender}
            isInvalid={!!errors.gender}
          >
            <option value='male'>{t('field.male')}</option>
            <option value='female'>{t('field.female')}</option>
            <option value='other'>{t('field.other')}</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className={style.inputGroup}>
          <Form.Label>{t('field.address')}</Form.Label>
          <CInput
            id='address'
            autoComplete='off'
            type='text'
            name='address'
            iref={register({
              required: 'field.error.required',
            })}
            placeholder={t('field.hint.address')}
            maxLength={200}
          />
        </Form.Group>

=======
>>>>>>> e7ce729 (push code verify email)
        <Form.Group></Form.Group>
        <p className={style.promptContent}>
          <Trans i18nKey='auth.promptContent' components={{ strong: <Link to={PageURL.PRIVACY_POLICY} /> }} />
        </p>
        <CButton type='submit' label={t('auth.register')} loading={onLoad} disabled={onLoad} size={ButtonSize.LARGE} className={style.btn} />
        <div className={style.redirect}>
          <p>{t('auth.haveAccount')} </p>
          <Link to={PageURL.LOGIN}>{t('auth.login')}</Link>
        </div>
      </Form>
    </AuthFormLayout>
  );
};

export default Register;
