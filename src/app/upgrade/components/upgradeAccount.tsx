import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from '../upgrade.module.scss';
import { doGetCreatePayment } from '../api';
import { useHistory, useLocation } from 'react-router-dom';
import { PageURL } from '@models/enum';
import { response } from 'express';

interface Props {
  sectionId: string;
}

export const UpgradeAccount: FC<Props> = (props) => {
  const { sectionId } = props;
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const [activePlan, setActivePlan] = useState<string>(localStorage.getItem('userPlan') || 'lite');

  const redirectToUpgradePage = () => {
    history.push(PageURL.UPGRADE);
  };
  const getQueryParams = (query: string) => {
    return new URLSearchParams(query);
  };

  const handlePurchase = async (amount: number, plan: string) => {
    try {
      const ipAddr = '127.0.0.1';
      const response = await doGetCreatePayment({ amount, ipAddr });

      if (response?.data?.url) {
        window.location.href = response.data.url;
      }
      // console.log('Payment response:', response);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const responseCode = queryParams.get('vnp_ResponseCode');
    const transactionStatus = queryParams.get('vnp_TransactionStatus');

    if (responseCode === '00' && transactionStatus === '00') {
      const newPlan = 'plus';
      setActivePlan(newPlan);
      localStorage.setItem('userPlan', newPlan);
      history.replace(PageURL.UPGRADE);
    }
  }, [location.search, history]);

  return (
    <div id={sectionId} title={t('title.update')}>
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
                  {/* {t('billed')} {t('discount.lite')} {t('yearly')} */}
                  {/* {t('litelite')} */}
                </p>
              </div>
              <button disabled={activePlan === 'lite'} className={style.selectButton1}>
                {activePlan === 'lite' ? t('button.actived') : t('button.getNow')}
              </button>
            </div>

            <div className={style.pricingCard}>
              <div className={style.planDetails}>
                <h5>{t('plans.plus')}</h5>
                <h6>{t('save.plus')}</h6>
              </div>
              <div className={style.block}>
                <p className={style.price}>{t('price.plus')}</p>
                <p>
                  {' '}
                  {t('billed')}
                  {t('monthly')}
                </p>
              </div>
              <button onClick={() => handlePurchase(100000, 'plus')} disabled={activePlan === 'plus'} className={style.selectButton2}>
                {activePlan === 'plus' ? t('button.actived') : t('button.getNow')}
              </button>
            </div>

            <div className={style.pricingCard}>
              <div className={style.planDetails}>
                <h5>{t('plans.max')}</h5>
                <h6>{t('save.max')}</h6>
              </div>
              <div className={style.block}>
                <p className={style.price}>{t('price.max')}</p>
                <p>
                  {' '}
                  {t('billed')} {t('monthly')}
                </p>
              </div>
              <button onClick={() => handlePurchase(200000, 'max')} disabled={activePlan === 'max'} className={style.selectButton3}>
                {activePlan === 'max' ? t('button.actived') : t('button.getNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeAccount;
