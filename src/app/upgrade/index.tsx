import React, { FC, HTMLAttributes } from 'react';
import { PageName, Palette } from '../../models/enum';
import { useTranslation } from 'react-i18next';
import style from './upgrade.module.scss';
import MainLayout from '../../common/ui/layout/main-layout';
import UpgradeAccount from './components/upgradeAccount';

interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
}

export const Upgrade: FC<Props> = ({ sectionId }) => {
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
      <UpgradeAccount sectionId={sectionId} />
      <div className={style.note}>
        <p>
          <strong>{t('upgrade.note.label')}</strong> {t('upgrade.note.description')}
        </p>
        <p>
          {t('upgrade.support')}
          <a href='mailto:hotro@hireme.vn'>hotro@hireme.vn</a> {t('or')}
          <strong> (032) 982 3154 </strong> ({t('upgrade.support.hours')})
        </p>
      </div>
    </MainLayout>
  );
};

export default Upgrade;
