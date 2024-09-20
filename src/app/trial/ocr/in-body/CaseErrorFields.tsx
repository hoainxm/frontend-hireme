import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CaseErrorField } from '../../shared/CaseErrorField';
import { SectionContainer } from '../../shared/SectionContainer';
import { INBODY_NON_EXTRACTED_CASES } from './constant';
import style from './inbody.module.scss';

interface Props {}

export const CaseErrorFields: FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <SectionContainer title={t('caseCannotExtracted')} contentClass={style.sectionContent}>
      <div className={style.caseErrorFields}>
        {INBODY_NON_EXTRACTED_CASES.map((c, index) => (
          <CaseErrorField key={index} image={c.image} content={c.content} />
        ))}
      </div>
    </SectionContainer>
  );
};
