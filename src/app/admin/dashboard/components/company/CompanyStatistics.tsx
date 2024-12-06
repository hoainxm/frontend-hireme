/** @format */

import React, { FC, useEffect } from 'react';
import { Chart } from 'chart.js';
import { fetchCompaniesByAdmin } from './api';
import { useTranslation } from 'react-i18next';
import { Card, Typography } from 'antd';
import { Company } from '../../../../company/model';

interface Props {
  id: string;
}

const { Title } = Typography;

const CompanyStatistics: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchCompaniesByAdmin(1, 1000);
        const companies: Company[] = res.data.result;

        renderCompanyScaleChart(companies);
        renderUpdatedCompaniesChart(companies);
        renderCreatedByChart(companies);
      } catch (error) {
        console.error(t('error.fetchFailed'));
      }
    };

    fetchData();
  }, []);

  // Chart to display company scales
  const renderCompanyScaleChart = (companies: Company[]) => {
    const ctx = document.getElementById('companyScaleChart') as HTMLCanvasElement;

    const scaleCounts: { [key: string]: number } = {};
    companies.forEach((company) => {
      const scale = company.scale || t('field.notSet');
      scaleCounts[scale] = (scaleCounts[scale] || 0) + 1;
    });

    const labels = Object.keys(scaleCounts);
    const data = Object.values(scaleCounts);
    const backgroundColors = labels.map((_, index) => `hsl(${(index * 360) / labels.length}, 70%, 50%)`);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: t('companyStatistics.companyScaleDistribution'),
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
            text: t('companyStatistics.companyScaleDistribution'),
          },
        },
      },
    });
  };

  // Chart to display updated companies
  const renderUpdatedCompaniesChart = (companies: Company[]) => {
    const ctx = document.getElementById('updatedCompaniesChart') as HTMLCanvasElement;

    const updatedCounts = {
      RecentlyUpdated: 0,
      NotRecentlyUpdated: 0,
    };

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    companies.forEach((company) => {
      const updatedAt = new Date(company.updatedAt);
      if (updatedAt > oneMonthAgo) {
        updatedCounts.RecentlyUpdated += 1;
      } else {
        updatedCounts.NotRecentlyUpdated += 1;
      }
    });

    const labels = [t('companyStatistics.recentlyUpdated'), t('companyStatistics.notRecentlyUpdated')];
    const data = [updatedCounts.RecentlyUpdated, updatedCounts.NotRecentlyUpdated];

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: t('companyStatistics.updateDistribution'),
            data,
            backgroundColor: ['#4CAF50', '#F44336'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: t('companyStatistics.updateDistribution'),
          },
        },
      },
    });
  };

  // Chart to display companies by creator
  const renderCreatedByChart = (companies: Company[]) => {
    const ctx = document.getElementById('createdByChart') as HTMLCanvasElement;

    const creatorCounts: { [key: string]: number } = {};
    companies.forEach((company) => {
      const creatorEmail = company.createdBy?.email || t('field.notSet');
      creatorCounts[creatorEmail] = (creatorCounts[creatorEmail] || 0) + 1;
    });

    const labels = Object.keys(creatorCounts);
    const data = Object.values(creatorCounts);
    const backgroundColors = labels.map((_, index) => `hsl(${(index * 360) / labels.length}, 70%, 50%)`);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            label: t('companyStatistics.companiesByCreator'),
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
            text: t('companyStatistics.companiesByCreator'),
          },
        },
      },
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
        {t('companyStatistics.pageTitle')}
      </Title>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Card style={{ width: '45%', minWidth: '300px' }}>
          <Title level={5}>{t('companyStatistics.companyScaleTitle')}</Title>
          <canvas id='companyScaleChart' width='300' height='300' style={{ maxWidth: '100%' }}></canvas>
        </Card>
        <Card style={{ width: '45%', minWidth: '300px' }}>
          <Title level={5}>{t('companyStatistics.updateStatusTitle')}</Title>
          <canvas id='updatedCompaniesChart' width='300' height='300' style={{ maxWidth: '100%' }}></canvas>
        </Card>
        {/* <Card style={{ width: '45%', minWidth: '300px' }}>
          <Title level={5}>{t('companyStatistics.createdByTitle')}</Title>
          <canvas id='createdByChart' width='300' height='300' style={{ maxWidth: '100%' }}></canvas>
        </Card> */}
      </div>
    </div>
  );
};

export default CompanyStatistics;
