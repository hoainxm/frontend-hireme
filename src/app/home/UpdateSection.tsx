import React, { FC, HTMLAttributes, useEffect, useState, useTransition } from 'react';
import { Palette } from '../../models/enum';
import { useTranslation } from 'react-i18next';
import { SectionLayout } from '../../common/ui/layout/section-layout';
import style from './home.module.scss';

interface Props {
  sectionId: string;
}
export const UpdateSection: FC<Props> = (props) => {
  const { sectionId } = props;
  const { t } = useTranslation();

  return (
    <SectionLayout id={sectionId} title='title.update' backgroundColor={Palette.WHITE}>
      <div className={style.updateSection}>
        <div className={style.plan}>
          <div className={style.headerBasic}>{t('level.basic')}</div>
          <ul className={style.features}>
            <li>✔ {t('level.basic')}</li>
            <li>✔ {t('level.basic')}</li>
            <li>✘ {t('level.basic')}</li>
            <li>✘ {t('level.basic')}</li>
          </ul>
          <button className={style.basicButton}>{t('button.experience')}</button>
        </div>

        <div className={style.plan}>
          <div className={style.headerStandard}>{t('level.standard')}</div>
          <ul className={style.features}>
            <li>✔ {t('level.basic')}</li>
            <li>✔ {t('level.basic')}</li>
            <li>✔ {t('level.basic')}</li>
            <li>✘ {t('level.basic')}</li>
          </ul>
          <button className={style.standardButton}>{t('button.buyNow')}</button>
        </div>

        <div className={style.plan}>
          <div className={style.headerPremium}>{t('level.premium')}</div>
          <ul className={style.features}>
            <li>✔ {t('level.basic')}</li>
            <li>✔ {t('level.basic')}</li>
            <li>✔ {t('level.basic')}</li>
            <li>✔ {t('level.basic')}</li>
          </ul>
          <button className={style.premiumButton}>{t('button.buyNow')}</button>
        </div>
      </div>
    </SectionLayout>
  );
};

export default UpdateSection;
