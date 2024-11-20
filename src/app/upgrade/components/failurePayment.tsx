import React, { FC, HTMLAttributes } from 'react';
import { PageName, Palette } from '../../../models/enum';
import { useTranslation } from 'react-i18next';
import style from './upgrade.module.scss';
import MainLayout from '../../../common/ui/layout/main-layout';

interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
}

export const FailurePayment: FC<Props> = ({ sectionId }) => {
  const { t } = useTranslation();

  return (
    <MainLayout active={PageName.UPGRADE}>
      <section id={sectionId} className={style.bannerSection}>
        <div className={style.bannerContainer}>
          <div className={style.top}>
            <h1 className={style.topTitle}>
              {t('upgradeAccount')}
              <h5>{t('upgradeAccount.title')}</h5>
            </h1>
          </div>
        </div>
      </section>
      <p>Thanh toán thất bại</p>
    </MainLayout>
  );
};

export default FailurePayment;
