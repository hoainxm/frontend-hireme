import React, { FC } from 'react';
import style from './productOcr.module.scss';
import CButton from '@base/button';
import { ButtonSize, ButtonVariant, PageURL, ScopeKey, ScopeValue } from '../../../models/enum';
import { Alert } from '../../../common/utils/popup';
import { ProductOCRCard } from '@base/card';
import { ROAD_MAP_OCR_PRODUCT } from './constant';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@models/rootReducer';

interface Props {
  sectionId: string;
}

export const Banner: FC<Props> = (props) => {
  const { sectionId } = props;
  const { t } = useTranslation();

  const history = useHistory();
  const userInfo = useSelector((state: RootState) => state.main.userInfo);
  const isAuthenticated = localStorage.getItem(ScopeKey.IS_AUTHENTICATED);

  const alertComingSoon = () =>
    Alert.comingSoon({
      title: t('comingSoon'),
      content: t('popup.comingSoon'),
      labelBtnCfm: t('btn.understood'),
    });

  const checkAuthenticatedNavigate = () => {
    history.push(isAuthenticated === ScopeValue.TRUE && userInfo ? PageURL.OCR_MEDICAL_DEVICE : PageURL.LOGIN, { path: PageURL.OCR_MEDICAL_DEVICE });
  };

  return (
    <section id={sectionId} className={style.bannerSection}>
      <div className={style.bannerContainer}>
        <div className={style.top}>
          <h1 className={style.topTitle}>{t('product.ocr')}</h1>
          <h2 className={style.topSubTitle}>{t('product.ocr.subTitle')}</h2>
          <div className={style.btnGroup}>
            <CButton
              label={t('contact.us')}
              variant={ButtonVariant.CONTAINED}
              size={ButtonSize.LARGE}
              className={style.contactBtn}
              onClick={alertComingSoon}
            />
            <CButton label={t('user.trial')} variant={ButtonVariant.OUTLINE} size={ButtonSize.LARGE} onClick={checkAuthenticatedNavigate} />
          </div>
        </div>

        <div className={style.productOCRRoadMap}>
          {ROAD_MAP_OCR_PRODUCT.map((item, index) => (
            <ProductOCRCard key={index} title={item.title} srcImage={item.srcImage} contents={item.contents} isReverse={index % 2 === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};
