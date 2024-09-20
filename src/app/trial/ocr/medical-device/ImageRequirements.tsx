import Check from '@images/CheckIcon.png';
import React, { FC } from 'react';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SectionContainer } from '../../shared/SectionContainer';
import { MEDICAL_DEVICE_IMAGE_REQUIREMENTS } from './constant';
import style from './medicalDevice.module.scss';

export const ImageRequirements: FC = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer title={t('imageRequirements')} className={style.wrapperSection} contentClass={style.sectionContent}>
      {MEDICAL_DEVICE_IMAGE_REQUIREMENTS.map((require, index) => (
        <div key={index} className={style.imageRequirementContainer}>
          <Image src={Check} width={16} height={16} />
          <p>{t(require.label, { value: require.value })}</p>
        </div>
      ))}
    </SectionContainer>
  );
};
