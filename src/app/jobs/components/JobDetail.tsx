import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Job } from '../model';
import { useTranslation } from 'react-i18next';
import { fetchJobById } from '../api';
import MainLayout from '@layout/main-layout';
import { PageName } from '@models/enum';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import InfoCompany from '../../company/components/InfoCompany';
import JobCard from './JobCard';
import GeneralInfo from './GeneralInfo';
import style from './JobDetail.module.scss';
import { ToastContainer } from 'react-toastify';
import { ClockCircleOutlined, MenuOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import FavoriteButton from './FavoriteButton';

dayjs.extend(relativeTime);

interface RouteParams {
  jobId: string;
}

const JobDetail: React.FC = () => {
  const { jobId } = useParams<RouteParams>();
  const { t } = useTranslation();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [idCompany, setIdCompany] = useState<string>('');

  const fetchJobDetail = async () => {
    try {
      const response = await fetchJobById(jobId);
      if (response.data.statusCode === 200) {
        setJob(response.data.data);
        setIdCompany(response.data.data.company._id);
        console.log('response.data.data.company._id: ', response.data.data.company._id);
      } else {
        setError(response.data.message || 'Failed to fetch job details.');
      }
    } catch (err) {
      setError('An error occurred while fetching job details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]);

  if (loading) {
    return <div className={style['job-detail__loading']}>{t('loading')}</div>;
  }

  if (error) {
    return <div className={style['job-detail__error']}>{error}</div>;
  }

  if (!job) {
    return <div className={style['job-detail__no-data']}>{t('noData')}</div>;
  }

  const isJobExpired = (endDate: string): boolean => {
    return dayjs(endDate).isBefore(dayjs());
  };

  return (
    <MainLayout active={PageName.JOBS}>
      <div className={style['job-detail']}>
        <div className={style['job-detail__left-column']}>
          <JobCard job={job} />
        </div>
        <div className={style['job-detail__right-column']}>
          <div className={style['job-detail__company-info']}>
            <InfoCompany idCompany={idCompany} />
          </div>
          <div className={style['job-detail__general-info']}>
            <GeneralInfo job={job} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetail;
