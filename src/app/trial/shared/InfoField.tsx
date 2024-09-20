import React, { FC } from 'react';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { IconMapName, SVGIcon } from '../../../common/ui/assets/icon';
import { Indicators } from './Indicators';
import style from './shared.module.scss';

interface Props {
  icon: keyof typeof IconMapName;
  field: string;
  src: string;
  indicators: Array<string>;
}

export const InfoField: FC<Props> = (props) => {
  const { icon, field } = props;
  const { t } = useTranslation();

  return (
    <div className={style.infoField}>
      <div className={style.header}>
        <div className={style.iconWrapper}>
          <SVGIcon icon={icon} size={19} />
        </div>
        <p className={style.label}>{t(field)}</p>
      </div>
      <div className={style.content}>
        <Image src={props.src} className={style.image} />
        <Indicators title={t('indicators')} indicators={props.indicators} className={style.indicatorsWrapper} />
      </div>
    </div>
  );
};
