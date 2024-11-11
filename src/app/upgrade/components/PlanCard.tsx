import React from 'react';
import { useTranslation } from 'react-i18next';

interface PlanCardProps {
  planName: string;
  price: string;
  savings: string;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ planName, price, savings, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h5>{t(planName)}</h5>
      <h6>{t(savings)}</h6>
      <p>
        {t(price)} / {t('month')}
      </p>
      <button onClick={onSelect}>{t('button.getNow')}</button>
    </div>
  );
};

export default PlanCard;
