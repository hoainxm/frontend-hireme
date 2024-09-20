import React, { FC } from 'react';
import style from './inbody.module.scss';
import { useTranslation } from 'react-i18next';
import { SectionContainer } from '../../shared/SectionContainer';
import { Image } from 'react-bootstrap';
import InbodyPaper from '@images/InbodyPaper.png';
import { Indicators } from '../../shared/Indicators';
import { INBODY_EXTRACTABLE_INFORMATION_FIELDS } from './constant';

interface Props {}

export const ExtractableInfoFields: FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer title={t('extractableInformationFields')}>
      <div className={style.extractableInfoFields}>
        <Image src={InbodyPaper} className={style.extractableImage} />
        <div className={style.indicatorsWrapper}>
          {INBODY_EXTRACTABLE_INFORMATION_FIELDS.map((f, index) => (
            <Indicators key={index} title={f.title} indicators={f.fields} className={style.indicatorInner} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
