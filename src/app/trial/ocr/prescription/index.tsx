import { RemainRequestCard } from '@base/card';
import { useGetRemainTurn } from '@hooks/useGetRemainTurn';
import { TrialContentLayout } from '@layout/trial-content-layout';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import style from '../../shared/shared.module.scss';
import { PrescriptionTrial } from './Trial';

interface Props {}

export const Prescription: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { trialAPIKey, remaining, getTrialTurn } = useGetRemainTurn();

  return (
    <TrialContentLayout
      title={t('product.ocr.prescription')}
      btnGroup={<RemainRequestCard className={style.btnRemainTurnWrapper} count={remaining} />}
    >
      <PrescriptionTrial remaining={remaining} trialAPIKey={trialAPIKey} getTrialTurn={getTrialTurn} />
    </TrialContentLayout>
  );
};
