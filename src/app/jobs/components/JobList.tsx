import React, { useState, useEffect } from 'react';
import style from '../jobs.module.scss';
import { useTranslation } from 'react-i18next';
import { Job as JobType } from '../../jobs/model';
import Job from '../components/Job';
import { BackToTop } from '@base/button/BackToTop';
import dayjs from 'dayjs';

interface JobListProps {
  listJobs?: JobType[];
  isSavedJobs?: boolean;
}

const JobList: React.FC<JobListProps> = ({ listJobs = [], isSavedJobs = false }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentJobs, setCurrentJobs] = useState<JobType[]>([]);
  const jobsPerPage = 10;
  const totalJobs = listJobs.length;
  const totalPages = Math.max(Math.ceil(totalJobs / jobsPerPage), 1);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  useEffect(() => {
    if (isSavedJobs) {
      const savedJobsFromStorage = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      setCurrentJobs(savedJobsFromStorage);
    } else {
      setCurrentJobs(listJobs.slice(indexOfFirstJob, indexOfLastJob));
    }
  }, [isSavedJobs, listJobs, currentPage, indexOfFirstJob, indexOfLastJob]);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const isJobExpired = (endDate: string): boolean => {
    return dayjs(endDate).isBefore(dayjs());
  };

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const timeDiff = end.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  return (
    <div className={style.jobListContainer}>
      <div className={style.jobList}>
        {listJobs && totalJobs > 0 && (
          <div className={style.jobCount}>
            {t('found')} {totalJobs} {t('job.match')}
          </div>
        )}
        {currentJobs.map((job) => (
          <Job key={job._id} job={job} isJobExpired={isJobExpired} getRemainingDays={getRemainingDays} />
        ))}
      </div>

      <div className={style.pagination}>
        {Number.isFinite(totalPages) &&
          totalPages > 0 &&
          Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              className={`${style.pageButton} ${currentPage === index + 1 ? style.active : ''}`}
            >
              {index + 1}
            </button>
          ))}
      </div>
      <BackToTop />
    </div>
  );
};

export default JobList;
