import React, { FC } from 'react';
import style from './medicalDevice.module.scss';
import { MEDICAL_DEVICE_EXTRACTABLE_INFORMATION_FIELDS } from './constant';
import { InfoField } from '../../shared/InfoField';
import { useTranslation } from 'react-i18next';
import { SectionContainer } from '../../shared/SectionContainer';

interface Props {}

export const ExtractableInfoFields: FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer title={t('extractableInformationFields')}>
      <div className={style.extractableInfoFields}>
        {MEDICAL_DEVICE_EXTRACTABLE_INFORMATION_FIELDS.map((exf, index) => (
          <InfoField key={index} icon={exf.icon} field={exf.field} src={exf.src} indicators={exf.indicators} />
        ))}
      </div>
    </SectionContainer>
  );
};
