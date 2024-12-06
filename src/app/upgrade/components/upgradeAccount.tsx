import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './upgrade.module.scss';
import { doPostCreatePayment, doGetVerifyTransaction, setPremium, setSubscriber } from '../api';
import { ScopeKey, ScopeValue } from '@models/enum';
import { Alert } from '../../../common/utils/popup';
import { PREMIUM_RANKING } from '../../../app/admin/dashboard/constants';
import { UserProfile } from 'app/auth/models';

interface Props {
  sectionId: string;
  userInfo: UserProfile;
  id: string;
}

export const UpgradeAccount: FC<Props> = (props) => {
  const { sectionId, userInfo, id } = props;
  const { t } = useTranslation();
  const [isPremium, setIsPremium] = useState<ScopeValue>((localStorage.getItem(ScopeKey.IS_PREMIUM_SECTION) as ScopeValue) || ScopeValue.LITE);
  const [amount, setAmount] = useState<string | null | number>(null);

  const handlePurchase = async (amount: number) => {
    try {
      const ipAddr = '127.0.0.1';
      const response = await doPostCreatePayment({ amount, ipAddr });

      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('Không thể tạo giao dịch.');
      }
      console.log('Payment response:', response);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const verifyTransaction = async (txnRef: string, vnp_Amount: string) => {
    try {
      const dataSubmit = { txnRef, vnp_Amount };
      const response = await doGetVerifyTransaction(dataSubmit);

      console.log('response.data', response.data);
      if (response?.data?.status === 'success') {
        const vnpAmountRaw = response?.data?.data?.vnp_Amount;
        const vnpAmount = parseInt(vnpAmountRaw, 10) / 100;

        if (isNaN(vnpAmount)) {
          return;
        }

        const dataSubscriber = { name: userInfo.name, email: userInfo.email, skills: userInfo.skills };

        const check = await setSubscriber(dataSubscriber);
        console.log('check', check);
        Alert.success({ title: t('sucess.title'), content: t('payment.success') });

        let plan = ScopeValue.LITE;
        if (vnpAmount === 100000) {
          plan = ScopeValue.PLUS;
        } else if (vnpAmount === 200000) {
          plan = ScopeValue.MAX;
        }
        localStorage.setItem(ScopeKey.IS_PREMIUM_SECTION, plan);
        setIsPremium(plan);
        console.log(setIsPremium);
        const dataSubmit = { typePre: plan };
        await setPremium(dataSubmit);
      }
    } catch (error) {
      console.error('Error verifying transaction:', error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const txnRef = queryParams.get('vnp_TxnRef');
    const vnp_Amount = queryParams.get('vnp_Amount');
    if (vnp_Amount) {
      setAmount(Number(amount) / 100);
    }

    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.replaceState(null, '', cleanUrl);

    if (txnRef) {
      verifyTransaction(txnRef, vnp_Amount as string);
    }
  }, [location]);

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
                {/* <h6>{t('save.lite')}</h6> */}
              </div>
              <div className={style.block}>
                <p className={style.price}>
                  {t('price.lite')}
                  {/* {t('month')} */}
                </p>
              </div>
              <button disabled={PREMIUM_RANKING[isPremium as ScopeValue] > PREMIUM_RANKING[ScopeValue.LITE]} className={style.selectButton1}>
                {isPremium === ScopeValue.LITE ? t('button.actived') : t('button.getNow')}
              </button>
            </div>

            <div className={style.pricingCard}>
              <div className={style.planDetails}>
                <h5>{t('plans.plus')}</h5>
                {/* <h6>{t('save.plus')}</h6> */}
              </div>
              <div className={style.block}>
                <p className={style.price}>{t('price.plus')}</p>
              </div>
              <button
                onClick={() => {
                  handlePurchase(100000);
                }}
                disabled={PREMIUM_RANKING[isPremium as ScopeValue] > PREMIUM_RANKING[ScopeValue.PLUS]}
                className={style.selectButton2}
              >
                {isPremium === ScopeValue.PLUS ? t('button.actived') : t('button.getNow')}
              </button>
            </div>

            <div className={style.pricingCard}>
              <div className={style.planDetails}>
                <h5>{t('plans.max')}</h5>
                {/* <h6>{t('save.max')}</h6> */}
              </div>
              <div className={style.block}>
                <p className={style.price}>{t('price.max')}</p>
              </div>
              <button
                onClick={() => {
                  handlePurchase(200000);
                }}
                disabled={PREMIUM_RANKING[isPremium as ScopeValue] > PREMIUM_RANKING[ScopeValue.MAX]}
                className={style.selectButton3}
              >
                {isPremium === ScopeValue.MAX ? t('button.actived') : t('button.getNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeAccount;
