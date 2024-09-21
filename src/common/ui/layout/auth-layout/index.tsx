/** @format */

import React, { FC, ReactNode, useEffect } from 'react';

import { Image } from 'react-bootstrap';
import LogoWhite from '@images/LogoWhite.png';
import { PageURL } from '../../../../models/enum';
import { configViewSetMeta } from '../../../../common/utils/common';
import style from './authLayout.module.scss';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
}

export const AuthLayout: FC<Props> = (props: Props) => {
  const { children } = props;
  const { t } = useTranslation();

  const history = useHistory();
  const redirectToHomePage = () => history.push(PageURL.HOME);

  useEffect(() => {
    configViewSetMeta('1.0', '1.0');
  }, []);

  return (
    <main className={style.auth}>
      <div className={style.logoContainer}>
        <Image src={LogoWhite} onClick={redirectToHomePage} />
        {/* <p>{t('title.name')}</p> */}
      </div>
      <div className={style.contentContainer}>
        <div className={style.content}>{children}</div>
      </div>
    </main>
  );
};
