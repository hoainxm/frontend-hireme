import { RemainRequestCard } from '@base/card';
import { useGetRemainTurn } from '@hooks/useGetRemainTurn';
import { TrialContentLayout } from '@layout/trial-content-layout';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import style from '../../shared/shared.module.scss';
import { MedicalDeviceTrial } from './Trial';

interface Props {}

export const MedicalDevice: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { trialAPIKey, remaining, getTrialTurn } = useGetRemainTurn();

  return (
    <TrialContentLayout
      title={t('product.ocr.medicalDevice')}
      btnGroup={<RemainRequestCard className={style.btnRemainTurnWrapper} count={remaining} />}
    >
      <MedicalDeviceTrial remaining={remaining} trialAPIKey={trialAPIKey} getTrialTurn={getTrialTurn} />
    </TrialContentLayout>
  );
};
