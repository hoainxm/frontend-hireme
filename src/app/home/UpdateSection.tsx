import React, { FC } from 'react';
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
    <SectionLayout id={sectionId} title={t('title.update')} backgroundColor={Palette.WHITE}>
      <div className={style.updateSection}>
        <div className={style.plan}>
          <div className={style.headerBasic}>{t('basic.title')}</div>
          <ul className={style.features}>
            <li>✔ {t('basic.advantage1')}</li>
            <li>✔ {t('basic.advantage2')}</li>
            <li>✘ {t('basic.disadvantage1')}</li>
            <li>✘ {t('basic.disadvantage2')}</li>
          </ul>
          <button className={style.basicButton}>{t('basic.button')}</button>
        </div>

        <div className={style.plan}>
          <div className={style.headerStandard}>{t('standard.title')}</div>
          <ul className={style.features}>
            <li>✔ {t('standard.advantage1')}</li>
            <li>✔ {t('standard.advantage2')}</li>
            <li>✔ {t('standard.advantage3')}</li>
            <li>✘ {t('standard.disadvantage1')}</li>
          </ul>
          <button className={style.standardButton}>{t('standard.button')}</button>
        </div>

        <div className={style.plan}>
          <div className={style.headerPremium}>{t('premium.title')}</div>
          <ul className={style.features}>
            <li>✔ {t('premium.advantage1')}</li>
            <li>✔ {t('premium.advantage2')}</li>
            <li>✔ {t('premium.advantage3')}</li>
            <li>✔ {t('premium.advantage4')}</li>
          </ul>
          <button className={style.premiumButton}>{t('premium.button')}</button>
        </div>
      </div>
    </SectionLayout>
  );
};

export default UpdateSection;
