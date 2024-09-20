import { Shortcut } from '@layout/model';
import React, { FC, HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import style from './trialSidebar.module.scss';
import { Alert } from '../../../../utils/popup';

interface Props extends HTMLAttributes<HTMLDivElement> {
  products: Array<Shortcut>;
}

export const Products: FC<Props> = (props) => {
  const { products } = props;
  const { t } = useTranslation();
  const history = useHistory();

  const onNavigate = (product: Shortcut) => {
    history.push(product.url);
  };

  const alertComingSoon = () =>
    Alert.comingSoon({
      title: t('comingSoon'),
      content: t('popup.comingSoon'),
      labelBtnCfm: t('btn.understood'),
    });

  const handleOnClick = (product: Shortcut) => {
    if (product.isDisabled) {
      alertComingSoon();
    } else {
      onNavigate(product);
    }
  };

  return (
    <div className={style.products}>
      {products.map((product) => (
        <p className={`${style.product} ${product.isActive && style.isActive}`} onClick={() => handleOnClick(product)}>
          {t(product.name)}
        </p>
      ))}
    </div>
  );
};
