/** @format */

import React, { FC, useEffect } from 'react';
import { Chart } from 'chart.js';
import { UserProfileByAdmin } from '../../../../auth/models';
import { fetchUsersByAdmin } from './api';
import { useTranslation } from 'react-i18next';
import { Card, Typography } from 'antd';
import { ROLES } from '../../constants';

interface Props {
  id: string;
}

const { Title } = Typography;

const getRoleNameById = (roleId: string): string => {
  const role = ROLES.find((r) => r._id === roleId);
  return role ? role.name : 'Unknown Role';
};

const UserStatistical: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchUsersByAdmin(1, 1000);
        const users: UserProfileByAdmin[] = res.data.result;
        renderRoleChart(users);
        renderPremiumChart(users);
        renderRevenueChart(users);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const renderRoleChart = (users: UserProfileByAdmin[]) => {
    const ctx = document.getElementById('roleChart') as HTMLCanvasElement;

    const roleCounts: { [key: string]: number } = {};
    users.forEach((user) => {
      const roleName = getRoleNameById(user.role) || t('field.notSet');
      roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
    });

    const labels = Object.keys(roleCounts);
    const data = Object.values(roleCounts);
    const backgroundColors = labels.map((_, index) => `hsl(${(index * 360) / labels.length}, 70%, 50%)`);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: t('userStatistics.usersPerRole'),
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
            text: t('userStatistics.usersPerRole'),
            font: {
              size: 14, // Smaller font size for title
            },
          },
        },
      },
    });
  };

  const renderPremiumChart = (users: UserProfileByAdmin[]) => {
    const ctx = document.getElementById('premiumChart') as HTMLCanvasElement;

    const premiumCounts = {
      Upgraded: 0,
      NotUpgraded: 0,
    };

    users.forEach((user) => {
      if (user.isPremium && user.isPremium !== 'bGl0ZQ==') {
        premiumCounts.Upgraded += 1;
      } else {
        premiumCounts.NotUpgraded += 1;
      }
    });

    const labels = [t('userStatistics.premium'), t('userStatistics.notUpgraded')];
    const data = [premiumCounts.Upgraded, premiumCounts.NotUpgraded];

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            label: t('userStatistics.premiumDistribution'),
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
            text: t('userStatistics.premiumDistribution'),
            font: {
              size: 14,
            },
          },
        },
      },
    });
  };

  const renderRevenueChart = (users: UserProfileByAdmin[]) => {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;

    const revenue = {
      PLUS: 0,
      MAX: 0,
    };

    users.forEach((user) => {
      if (user.isPremium === 'cGx1cw==') {
        revenue.PLUS += 100000;
      } else if (user.isPremium === 'bWF4') {
        revenue.MAX += 200000;
      }
    });

    const totalRevenue = revenue.PLUS + revenue.MAX;

    const labels = [t('userStatistics.plusRevenue'), t('userStatistics.maxRevenue')];
    const data = [revenue.PLUS, revenue.MAX];
    const backgroundColors = ['#36A2EB', '#FFCE56'];

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: t('userStatistics.monthlyRevenue'),
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
            text: `${t('userStatistics.totalRevenue')}: ${totalRevenue.toLocaleString()} VND`,
            font: {
              size: 14,
            },
          },
        },
      },
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>
        {t('userStatistics.pageTitle')}
      </Title>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Card style={{ width: '40%', padding: '10px' }}>
          <Title level={5} style={{ fontSize: '14px', textAlign: 'center' }}>
            {t('userStatistics.chartTitle.premium')}
          </Title>
          <canvas id='premiumChart' width='150' height='150' style={{ maxWidth: '100%' }}></canvas>
        </Card>
        <Card style={{ width: '40%', padding: '10px' }}>
          <Title level={5} style={{ fontSize: '14px', textAlign: 'center' }}>
            {t('userStatistics.chartTitle.role')}
          </Title>
          <canvas id='roleChart' width='150' height='150' style={{ maxWidth: '100%' }}></canvas>
        </Card>
        <Card style={{ width: '80%', padding: '10px' }}>
          <Title level={5} style={{ fontSize: '14px', textAlign: 'center' }}>
            {t('userStatistics.chartTitle.revenue')}
          </Title>
          <canvas id='revenueChart' width='200' height='150' style={{ maxWidth: '100%' }}></canvas>
        </Card>
      </div>
    </div>
  );
};

export default UserStatistical;
