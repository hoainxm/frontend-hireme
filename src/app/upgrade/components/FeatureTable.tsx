import React from 'react';
import { useTranslation } from 'react-i18next';

interface FeatureTableProps {
  features: Array<{ name: string; plans: Array<boolean> }>;
  planNames: string[];
}

const FeatureTable: React.FC<FeatureTableProps> = ({ features, planNames }) => {
  const { t } = useTranslation();

  return (
    <table>
      <thead>
        <tr>
          <th>{t('title.feature')}</th>
          {planNames.map((planName, index) => (
            <th key={index}>{planName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {features.map((feature, index) => (
          <tr key={index}>
            <td>{t(feature.name)}</td>
            {feature.plans.map((isAvailable, planIndex) => (
              <td key={planIndex}>{isAvailable ? '✔' : '✘'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FeatureTable;
