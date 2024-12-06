/** @format */

import React, { FC, useEffect } from 'react';
import { Chart } from 'chart.js';
import { fetchCVsByAdmin } from './api';
import { CV } from './model';
import { useTranslation } from 'react-i18next';
import { Card, Typography } from 'antd';

interface Props {
  id: string;
}

const { Title } = Typography;

const CVStatistics: FC<Props> = (props) => {
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchCVsByAdmin(1, 1000);
        const cvs: CV[] = res.data.result;

        renderCVStatusChart(cvs);
      } catch (error) {
        console.error(t('error.fetchFailed'), error);
      }
    };

    fetchData();
  }, []);

  const renderCVStatusChart = (cvs: CV[]) => {
    const ctx = document.getElementById('cvStatusChart') as HTMLCanvasElement;

    const statusColors: { [key: string]: string } = {
      PENDING: '#3498DB',
      REVIEW: '#F1C40F',
      APPROVED: '#2ECC71',
      REJECTED: '#E74C3C',
      [t('field.notSet')]: '#BDC3C7',
    };

    const statusCounts: { [key: string]: number } = {};
    cvs.forEach((cv) => {
      const status = cv.status || t('field.notSet');
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    const backgroundColors = labels.map((label) => statusColors[label] || '#BDC3C7');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: t('cvStatistics.statusDistribution'),
            data,
            backgroundColor: backgroundColors,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: t('cvStatistics.statusDistribution'),
          },
        },
      },
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
        {t('cvStatistics.pageTitle')}
      </Title>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: '60%', minWidth: '300px' }}>
          <Title level={5}>{t('cvStatistics.chartTitle')}</Title>
          <canvas id='cvStatusChart' width='400' height='400' style={{ maxWidth: '100%' }}></canvas>
        </Card>
      </div>
    </div>
  );
};

export default CVStatistics;
