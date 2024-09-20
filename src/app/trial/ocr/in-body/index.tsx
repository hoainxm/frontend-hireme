import { RemainRequestCard } from '@base/card';
import { useGetRemainTurn } from '@hooks/useGetRemainTurn';
import { TrialContentLayout } from '@layout/trial-content-layout';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import style from '../../shared/shared.module.scss';
import { InbodyTrial } from './Trial';

export const Inbody: FC = () => {
  const { t } = useTranslation();
  const { trialAPIKey, remaining, getTrialTurn } = useGetRemainTurn();

  return (
    <TrialContentLayout title={t('product.ocr.inBody')} btnGroup={<RemainRequestCard className={style.btnRemainTurnWrapper} count={remaining} />}>
      <InbodyTrial remaining={remaining} trialAPIKey={trialAPIKey} getTrialTurn={getTrialTurn} />
    </TrialContentLayout>
  );
};
