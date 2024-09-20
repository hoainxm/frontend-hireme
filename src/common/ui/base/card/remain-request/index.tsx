import React, { FC, HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import style from './remainRequest.module.scss';
import { NOT_SET } from '../../../../utils/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {
  count: number | null;
}

export const RemainRequestCard: FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <div className={`${style.wrapper} ${props.className}`}>
      <div className={style.inner}>
        <h6>{t('remainingFreeTurns')}</h6>
        <h4 className={style.count}>{props.count !== null ? t('count.turn', { value: props.count }) : NOT_SET}</h4>
      </div>
    </div>
  );
};
