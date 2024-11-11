import React, { FC, HTMLAttributes } from 'react';
import { FEATURES, PLAN_OPTIONS } from './constant';
import style from './upgrade.module.scss';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layout/main-layout';
import { PageName } from '@models/enum';

interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
}

export const UpgradeAccount: FC<Props> = ({ sectionId }) => {
  const { t } = useTranslation();
  const currentPlan = 'lite';

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

      <div className={style.upgradeTableContainer}>
        <div className={style.updateSectionContainer}>
          <div className={style.comparisonWrapper}>
            <table className={style.comparisonTable}>
              <thead>
                <tr>
                  <th>{t('title.feature')}</th>
                  <th>{PLAN_OPTIONS.lite.name}</th>
                  <th>{PLAN_OPTIONS.plus.name}</th>
                  <th>{PLAN_OPTIONS.max.name}</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature) => (
                  <tr key={feature.key}>
                    <td>{feature.label}</td>
                    <td>{PLAN_OPTIONS.lite[feature.key as keyof typeof PLAN_OPTIONS.lite] ? '✔' : '✘'}</td>
                    <td>{PLAN_OPTIONS.plus[feature.key as keyof typeof PLAN_OPTIONS.plus] ? '✔' : '✘'}</td>
                    <td>{PLAN_OPTIONS.max[feature.key as keyof typeof PLAN_OPTIONS.max] ? '✔' : '✘'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
      </div>
    </MainLayout>
  );
};

export default UpgradeAccount;
