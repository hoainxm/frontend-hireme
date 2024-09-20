import React, { FC, HTMLAttributes, ReactElement } from 'react';
import style from './computerVision.module.scss';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TruncatedTextTooltip } from '../../tool-tip/TruncatedTextTooltip';

interface Props extends HTMLAttributes<HTMLDivElement> {
  image: string;
  content: string;
}

export const ComputerVisionCard: FC<Props> = (props) => {
  const { image, content } = props;
  const { t } = useTranslation();

  const hasSlash = t(content).includes('/'); // text includes slash cannot wrap normally => use break-all

  return (
    <div className={style.wrapper}>
      <div className={style.top}>
        <div className={style.glass} />
        <Image src={image} />
      </div>
      <TruncatedTextTooltip id={content} tooltipContent={content} placement='bottom' className={`${style.bottom} ${hasSlash && style.hasSlash}`}>
        {t(content)}
      </TruncatedTextTooltip>
    </div>
  );
};
