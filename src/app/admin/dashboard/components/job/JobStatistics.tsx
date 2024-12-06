import React, { FC, useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { fetchJobsByAdmin } from './api';
import { Job } from '../../../../jobs/model';
import { useTranslation } from 'react-i18next';
import { Card } from 'antd';

interface Props {
  id: string;
}

Chart.register(...registerables);

const JobStatistics: FC<Props> = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchJobData();
  }, []);

  const fetchJobData = async () => {
    try {
      const res = await fetchJobsByAdmin(1, 1000);
      const { result } = res.data;
      setJobs(result);
      renderCharts(result);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const renderCharts = (jobData: Job[]) => {
    renderStatusChart(jobData);
    renderCompanyChart(jobData);
    renderLevelChart(jobData);
  };

  const renderStatusChart = (jobData: Job[]) => {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;

    const statusCounts = jobData.reduce(
      (acc, job) => {
        acc[job.isActive ? 'Active' : 'Inactive'] += 1;
        return acc;
      },
      { Active: 0, Inactive: 0 }
    );

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [t('status.active'), t('status.inactive')],
        datasets: [
          {
            data: [statusCounts.Active, statusCounts.Inactive],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: t('jobStatistics.statusDistribution'),
          },
        },
      },
    });
  };

  const renderCompanyChart = (jobData: Job[]) => {
    const ctx = document.getElementById('companyChart') as HTMLCanvasElement;

    const companyCounts: { [key: string]: number } = {};
    jobData.forEach((job) => {
      const companyName = job.company?.name || t('field.notSet');
      companyCounts[companyName] = (companyCounts[companyName] || 0) + 1;
    });

    const labels = Object.keys(companyCounts);
    const data = Object.values(companyCounts);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: t('jobStatistics.jobsPerCompany'),
            data,
            backgroundColor: '#FFCE56',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: t('jobStatistics.jobsPerCompany'),
          },
        },
        scales: {
          x: {
            ticks: {
              stepSize: 1,
              callback: function (value: any) {
                return Number(value);
              },
            },
            beginAtZero: true,
          },
        },
      },
    });
  };

  const renderLevelChart = (jobData: Job[]) => {
    const ctx = document.getElementById('levelChart') as HTMLCanvasElement;

    const levelCounts: { [key: string]: number } = {};
    jobData.forEach((job) => {
      const level = job.level || t('field.notSet');
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });

    const labels = Object.keys(levelCounts);
    const data = Object.values(levelCounts);

    const generateColors = (numColors: number) => {
      const colors = [];
      for (let i = 0; i < numColors; i++) {
        const hue = (i * 360) / numColors;
        const saturation = 70 + (i % 2) * 10;
        const lightness = 50 + (i % 3) * 10;
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
      }
      return colors;
    };

    const backgroundColors = generateColors(labels.length);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: t('jobStatistics.jobsPerLevel'),
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
            text: t('jobStatistics.jobsPerLevel'),
          },
        },
      },
    });
  };

  return (
    <div>
      <h4>{t('jobStatistics.title')}</h4>
      <Card>
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <canvas id='companyChart'></canvas>
        </div>
      </Card>
      <Card>
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <canvas id='levelChart'></canvas>
        </div>
      </Card>
      <Card>
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <canvas id='statusChart'></canvas>
        </div>
      </Card>
    </div>
  );
};

export default JobStatistics;
