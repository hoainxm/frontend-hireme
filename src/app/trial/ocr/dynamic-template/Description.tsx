import React, { FC, HTMLAttributes } from 'react';

import { useTranslation } from 'react-i18next';
import { DescriptionModal } from '../../shared/DescriptionModal';
import { CaseErrorField } from '../../shared/CaseErrorField';
import { LCD_DYNAMIC_EXTRACTED_CASES, PAPER_DYNAMIC_EXTRACTED_CASES } from './constant';
import style from './dynamicTemplate.module.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  toggle: () => void;
}

export const DynamicTemplateDescription: FC<Props> = (props) => {
  const { isOpen, toggle } = props;
  const { t } = useTranslation();

  return (
    <DescriptionModal
      title={t('product.ocr.instructionDynamicTemplates')}
      isOpen={isOpen}
      toggle={toggle}
      classContent={style.bodyModalContainer}
      children={
        <>
          <hr />
          <div className={style.descriptionContainer}>
            <div className={style.block}>
              <h4>{t('product.ocr.description.paper')}</h4>
              <div className={style.caseErrorFields}>
                {PAPER_DYNAMIC_EXTRACTED_CASES.map((c, index) => (
                  <CaseErrorField key={index} image={c.image} content={c.content} />
                ))}
              </div>
            </div>
            <div className={style.block}>
              <h4>{t('product.ocr.description.lcd')}</h4>
              <div className={style.caseErrorFields}>
                {LCD_DYNAMIC_EXTRACTED_CASES.map((c, index) => (
                  <CaseErrorField key={index} image={c.image} content={c.content} />
                ))}
              </div>
            </div>
          </div>
        </>
      }
    />
  );
};
