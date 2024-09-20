import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CaseErrorField } from '../../shared/CaseErrorField';
import { SectionContainer } from '../../shared/SectionContainer';
import style from './prescription.module.scss';
import { PRESCRIPTION_NON_EXTRACTED_CASES } from './constant';

interface Props {}

export const CaseErrorFields: FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <SectionContainer title={t('caseCannotExtracted')} contentClass={style.sectionContent}>
      <div className={style.caseErrorFields}>
        {PRESCRIPTION_NON_EXTRACTED_CASES.map((c, index) => (
          <CaseErrorField key={index} image={c.image} content={c.content} />
        ))}
      </div>
    </SectionContainer>
  );
};
