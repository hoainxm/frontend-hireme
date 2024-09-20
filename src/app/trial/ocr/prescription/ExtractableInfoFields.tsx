import PrescriptionPaper from '@images/PrescriptionPaper.png';
import React, { FC } from 'react';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Indicators } from '../../shared/Indicators';
import { SectionContainer } from '../../shared/SectionContainer';
import { PRESCRIPTION_EXTRACTABLE_INFORMATION_FIELDS } from './constant';
import style from './prescription.module.scss';

interface Props {}

export const ExtractableInfoFields: FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer title={t('extractableInformationFields')}>
      <div className={style.extractableInfoFields}>
        <Image src={PrescriptionPaper} />
        <div className={style.indicatorsWrapper}>
          {PRESCRIPTION_EXTRACTABLE_INFORMATION_FIELDS.map((f, index) => (
            <Indicators key={index} title={t(f.title)} indicators={f.fields} className={style.indicatorInner} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
