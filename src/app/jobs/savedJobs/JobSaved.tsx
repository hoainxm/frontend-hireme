import React, { FC, HTMLAttributes, useEffect, useState, useTransition } from 'react';
import { Job } from '../model';
import style from '../jobs.module.scss';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import MainLayout from '@layout/main-layout';
import { PageName, SectionID } from '@models/enum';
import JobList from '../components/JobList';

const SaveJobList: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const savedJobsFromStorage = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(savedJobsFromStorage);
  }, []);

  const handleJobClick = (jobId: string) => {
    history.push(`/jobs/${jobId}`);
  };

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const timeDiff = end.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  const removeSavedJob = (jobId: string) => {
    const updatedSavedJobs = savedJobs.filter((job) => job._id !== jobId);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
    setSavedJobs(updatedSavedJobs);
  };

  // if (savedJobs.length === 0) {
  //   return <div>{t('noSavedJobs')}</div>;
  // }

  if (savedJobs.length === 0) {
    return (
      <div className={style['no-saved-jobs']}>
        <h2 className={style['no-saved-jobs__title']}>{t('noSavedJobs')}</h2>
        <p className={style['no-saved-jobs__message']}>{t('checkJobsPage')}</p>
        <button className={style['no-saved-jobs__button']} onClick={() => history.push('/jobs')}>
          {t('browseJobs')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <JobList listJobs={savedJobs} isSavedJobs={true} />
    </div>
  );
};

export default SaveJobList;
