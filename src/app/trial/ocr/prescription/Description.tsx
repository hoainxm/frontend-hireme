import React, { FC, HTMLAttributes, useState } from 'react';
import style from './prescription.module.scss';
import { ImageRequirements } from './ImageRequirements';
import { CaseErrorFields } from './CaseErrorFields';
import { ExtractableInfoFields } from './ExtractableInfoFields';
import CButton from '@base/button';
import { ButtonVariant } from '@models/enum';
import { useTranslation } from 'react-i18next';
import { DescriptionModal } from '../../shared/DescriptionModal';

interface Props extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  toggle: () => void;
}

export const PrescriptionDescription: FC<Props> = (props) => {
  const { isOpen, toggle } = props;
  const { t } = useTranslation();

  return (
    <>
      <CButton variant={ButtonVariant.OUTLINE} className='mb-4' onClick={toggle}>
        {t('howToUse')}
      </CButton>
      <DescriptionModal
        title={t('cfm.scanPrescription')}
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
