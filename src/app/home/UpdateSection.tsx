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
    <SectionLayout id={sectionId} title={t('title.update')}>
      <div className={style.updateSectionContainer}>
        <div className={style.leftSection}>
          <div className={style.comparisonWrapper}>
            <table className={style.comparisonTable}>
              <thead>
                <tr>
                  <th>{t('title.feature')}</th>
                  <th>{t('lite.title')}</th>
                  <th>{t('plus.title')}</th>
                  <th>{t('max.title')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t('features.feature1')}</td>
                  <td>✔</td>
                  <td>✔</td>
                  <td>✔</td>
                </tr>
                <tr>
                  <td>{t('features.feature2')}</td>
                  <td>✔</td>
                  <td>✔</td>
                  <td>✔</td>
                </tr>
                <tr>
                  <td>{t('features.feature3')}</td>
                  <td>✘</td>
                  <td>✔</td>
                  <td>✔</td>
                </tr>
                <tr>
                  <td>{t('features.feature4')}</td>
                  <td>✘</td>
                  <td>✔</td>
                  <td>✔</td>
                </tr>
                <tr>
                  <td>{t('features.feature5')}</td>
                  <td>✘</td>
                  <td>✘</td>
                  <td>✔</td>
                </tr>
                <tr>
                  <td>{t('features.feature6')}</td>
                  <td>✘</td>
                  <td>✘</td>
                  <td>✔</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={style.rightSection}>
          <h4>{t('title.selectPlan')}</h4>
          <div className={style.pricingOptions}>
            <div className={style.pricingCard}>
              <div className={style.planDetails}>
                <h5>{t('plans.lite')}</h5>
                <h6>{t('save.lite')}</h6>
              </div>
              <div className={style.block}>
                <p className={style.price}>
                  {t('price.lite')}
                  {t('month')}
                </p>
                <p>
                  {' '}
                  {t('billed')} {t('discount.lite')} {t('yearly')}
                </p>
              </div>
              <button className={style.selectButton1}>{t('button.getNow')}</button>
            </div>

            <div className={style.pricingCard}>
              <div className={style.planDetails}>
                <h5>{t('plans.plus')}</h5>
                <h6>{t('save.plus')}</h6>
              </div>
              <div className={style.block}>
                <p className={style.price}>
                  {t('price.plus')}
                  {t('month')}
                </p>
                <p>
                  {' '}
                  {t('billed')} {t('discount.plus')} {t('yearly')}
                </p>
              </div>
              <button className={style.selectButton2}>{t('button.getNow')}</button>
            </div>

            <div className={style.pricingCard}>
              <div className={style.planDetails}>
                <h5>{t('plans.max')}</h5>
                <h6>{t('save.max')}</h6>
              </div>
              <div className={style.block}>
                <p className={style.price}>
                  {t('price.max')}
                  {t('month')}
                </p>
                <p>
                  {' '}
                  {t('billed')} {t('discount.max')} {t('yearly')}
                </p>
              </div>
              <button className={style.selectButton3}>{t('button.getNow')}</button>
            </div>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};

export default UpdateSection;
