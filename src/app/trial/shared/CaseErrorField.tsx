import { TruncatedTextTooltip } from '@base/tool-tip/TruncatedTextTooltip';
import ErrorIcon from '@images/Error.png';
import React, { FC } from 'react';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import style from './shared.module.scss';

interface Props {
  image: string;
  content: { label: string; value: string | number };
}

export const CaseErrorField: FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <div className={style.caseErrorField}>
      <div className={style.errorImageContainer}>
        <Image src={props.image} className={style.errorImage} />
        <Image src={ErrorIcon} className={style.errorIcon} />
      </div>
      <div className={style.content}>
        <TruncatedTextTooltip
          id={props.content.label}
          className={style.text}
          tooltipContent={t(props.content.label, { value: props.content.value })}
          placement='bottom'
        >
          {t(props.content.label, { value: props.content.value })}
        </TruncatedTextTooltip>
      </div>
    </div>
  );
};
