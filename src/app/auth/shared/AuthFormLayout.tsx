import Line from '@images/Line.svg';
import { AuthLayout } from '@layout/auth-layout';
import { Palette } from '@models/enum';
import React, { PropsWithChildren, ReactElement } from 'react';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SVGIcon } from '../../../common/ui/assets/icon';
import { LanguageDropDown } from '../../../common/ui/base/dropdown/LanguageDropDown';
import style from '../auth.module.scss';

interface Props {
  otherError?: string;
  loginError?: string;
  title: string;
  subTitle?: string;
  hasLanguageDropDown?: boolean;
  backTo?: string;
  icon?: string;
}

export const AuthFormLayout = (props: PropsWithChildren<Props>): ReactElement => {
  const { hasLanguageDropDown = false, backTo, icon } = props;
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <AuthLayout>
      <div className={style.authContent}>
        {backTo && (
          <div className={style.turnBack} onClick={() => history.push(backTo)}>
            <SVGIcon icon='ArrowLeft' className='mb-1' color={Palette.BLACK} size={16} />
            <p>{t('btn.back')}</p>
          </div>
        )}
        <div className={style.authTitle}>
          {icon && <Image src={icon} />}
          <h3>{t(props.title)}</h3>
          <Image src={Line} />
          <Image src={Line} />
        </div>
        {props.subTitle && <div className={style.authSubTitle}>{t(props.subTitle)}</div>}
        <div className={style.hint}>
          {props.otherError && <div className={style.hintError}>{t(props.otherError)}</div>}
          {props.loginError && <div className={style.hintError}>{t(props.loginError)}</div>}
        </div>
        {props.children}
        {hasLanguageDropDown && (
          <div className={style.langContainer}>
            <LanguageDropDown />
          </div>
        )}
      </div>
    </AuthLayout>
  );
};
