import Check from '@images/CheckIcon.png';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionContainer } from '../../shared/SectionContainer';
import { PRESCRIPTION_IMAGE_REQUIREMENTS } from './constant';
import style from './prescription.module.scss';
import { Image } from 'react-bootstrap';

export const ImageRequirements: FC = (props) => {
  const { t } = useTranslation();

  return (
    <SectionContainer title={t('imageRequirements')} className={style.wrapperSection} contentClass={style.sectionContent}>
      {PRESCRIPTION_IMAGE_REQUIREMENTS.map((require) => (
        <div className={style.imageRequirementContainer}>
          <Image src={Check} width={16} height={16} />
          <p>{t(require.label, { value: require.value })}</p>
        </div>
      ))}
    </SectionContainer>
  );
};
