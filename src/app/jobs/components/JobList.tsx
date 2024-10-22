import style from '../jobs.module.scss';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { BackToTop } from '@base/button/BackToTop';
import { Job } from '../../jobs/model';
import { useHistory } from 'react-router-dom';

interface JobListProps {
  listJobs: Job[];
}

const JobList: React.FC<JobListProps> = ({ listJobs }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 10;

  const totalPages = Math.ceil(listJobs?.length / jobsPerPage);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = listJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

  return (
    <div className={style.jobListContainer}>
      <div className={style.jobList}>
        {listJobs && listJobs.length > 0 && (
          <div className={style.jobCount}>
            {t('found')} {listJobs.length} {t('job.match')}
          </div>
        )}
        {listJobs &&
          listJobs.length > 0 &&
          currentJobs.map((job) => (
            <div
              key={job._id}
              className={style.jobCard}
              onClick={() => {
                handleJobClick(job._id);
              }}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}/images/company/${job.company.logo}`}
                alt={`${job.company.name} logo`}
                className={style.logo}
              />
              <div className={style.jobDetails}>
                <div className={style.top}>
                  <div className={style.jobTitle}>
                    {job.name}
                    <div className={style.companyName}>{job.company.name}</div>
                  </div>

                  <div className={style.salary}>{job.salary.toLocaleString()} VND</div>
                </div>
                <div className={style.bottom}>
                  <div className={style.location}>{job.location}</div>
                  <div className={style.skills}>{job.skills.join(', ')}</div>
                  <div className={style.timeRemaining}>{`${getRemainingDays(job.endDate)} ${t('timeRemaining')}`}</div>
                  <button className={style.btnApply}>Apply Now</button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className={style.pagination}>
        {[...Array(totalPages)].map((_, index) => (
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
