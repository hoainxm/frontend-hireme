import React, { FC, HTMLAttributes } from 'react';
import { CaseErrorFields } from './CaseErrorFields';
import { ExtractableInfoFields } from './ExtractableInfoFields';
import { ImageRequirements } from './ImageRequirements';
import style from './medicalDevice.module.scss';
import CButton from '@base/button';
import { ButtonVariant } from '@models/enum';
import { useTranslation } from 'react-i18next';
import { DescriptionModal } from '../../shared/DescriptionModal';

interface Props extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  toggle: () => void
}

export const MedicalDeviceDescription: FC<Props> = (props) => {
  const { isOpen, toggle } = props;
  const { t } = useTranslation();

  return (
    <>
      <CButton variant={ButtonVariant.OUTLINE} className='mb-4' onClick={toggle}>
        {t('howToUse')}
      </CButton>
      <DescriptionModal
        title={t('cfm.scanMedicalDevice')}
        isOpen={isOpen}
        toggle={toggle}
        children={
          <div className={style.container}>
            <div className={style.firstBlock}>
              <ImageRequirements />
              <CaseErrorFields />
            </div>
            <ExtractableInfoFields />
          </div>
        }
      />
    </>
  );
};
