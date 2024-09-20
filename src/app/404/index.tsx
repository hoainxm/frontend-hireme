/** @format */

import React, { FC } from 'react';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SearchNotFound from '@images/SearchNotFound.png';
import style from './error.module.scss';

interface Props {
  smallPage?: boolean;
  content?: string;
}

const HTTP404: FC<Props> = (props: Props) => {
  const { content = '404.content' } = props;
  const { t } = useTranslation();

  return (
    <div className={props.smallPage ? style.errorPage : `${style.errorPage} ${style.fullPage}`}>
      <Image src={SearchNotFound} />
      <h2 className={style.header}>{t('404.header')}</h2>
      <h4 className={style.content}>{t(content)}</h4>
      {/* {!props.smallPage && (
        <CButton
          size={ButtonSize.LARGE}
          onClick={() => history.push(PageURL.HOME)}
        >
          {t("404.returnHomePage")}
        </CButton>
      )} */}
    </div>
  );
};

export default HTTP404;
