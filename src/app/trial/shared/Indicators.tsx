import React, { FC, HTMLAttributes } from 'react';
import style from './shared.module.scss';
import { TruncatedTextTooltip } from '@base/tool-tip/TruncatedTextTooltip';
import { useTranslation } from 'react-i18next';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  indicators: Array<string>;
}

export const Indicators: FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <div className={`${style.indicatorsContainer} ${props.className}`}>
      <p className={style.indicatorsTitle}>{props.title}</p>
      <div className={style.indicatorList}>
        {props.indicators.map((indicator, index) => (
          <TruncatedTextTooltip id={`${indicator}_${index}`} tooltipContent={t(indicator)} placement='bottom' className={style.indicatorsLabel}>
            {t(indicator)}
          </TruncatedTextTooltip>
        ))}
      </div>
    </div>
  );
};
