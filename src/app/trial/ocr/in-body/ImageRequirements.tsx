import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SVGIcon } from '../../../../common/ui/assets/icon';
import { SectionContainer } from '../../shared/SectionContainer';
import { INBODY_IMAGE_REQUIREMENTS } from './constant';
import style from './inbody.module.scss';
import { Image } from 'react-bootstrap';
import Check from '@images/CheckIcon.png';

export const ImageRequirements: FC = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer title={t('imageRequirements')} className={style.wrapperSection} contentClass={style.sectionContent}>
      {INBODY_IMAGE_REQUIREMENTS.map((require) => (
        <div className={style.imageRequirementContainer}>
          <Image src={Check} width={16} height={16} />
          <p>{t(require.label, { value: require.value })}</p>
        </div>
      ))}
    </SectionContainer>
  );
};
