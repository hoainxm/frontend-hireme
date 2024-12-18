import React, { useEffect, useState } from 'react';
import { Job } from '../../jobs/model';
import { fetchJobBySkill } from '../api';
import { getJobsByCompany } from '../../company/api';
import style from './RelatedJobs.module.scss';
import FavoriteButton from './FavoriteButton';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { Tooltip } from 'antd';

interface RelatedJobsProps {
  skills?: string[];
  idCompany?: string;
}

const RelatedJobs: React.FC<RelatedJobsProps> = ({ idCompany, skills }) => {
  const [relatedJobs, setRelatedJobs] = useState<Job[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const { t } = useTranslation();
  const history = useHistory();

  const fetchRelatedJobs = async () => {
    try {
      let jobs: Job[] = [];

      if (idCompany) {
        const companyJobs = await getJobsByCompany(idCompany);
        if (companyJobs && companyJobs.data) {
          jobs = jobs.concat(companyJobs.data);
        }
      }

      if (skills && skills.length > 0) {
        const skillJobs = await fetchJobBySkill(skills);
        if (skillJobs && skillJobs.data) {
          jobs = jobs.concat(skillJobs.data);
        }
      }

      const uniqueJobs = Array.from(new Set(jobs.map((job) => job._id)))
        .map((id) => jobs.find((job) => job._id === id))
        .filter((job): job is Job => job !== undefined);

      setRelatedJobs(uniqueJobs);
    } catch (error) {
      console.error('Error fetching related jobs:', error);
    }
  };

  useEffect(() => {
    fetchRelatedJobs();
  }, [idCompany, skills]);

  if (!relatedJobs || relatedJobs.length === 0) {
    return <div>{t('field.hint.noData')}</div>;
  }

  const isJobExpired = (endDate: string): boolean => {
    return dayjs(endDate).isBefore(dayjs(), 'day');
  };

  const totalPages = Math.ceil(relatedJobs.length / jobsPerPage);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = relatedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handleJobClick = (jobId: string) => {
    history.push(`/jobs/${jobId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={style['related-jobs-container']}>
      <div className={style['related-jobs']}>
        <h3 className={style['related-jobs__title']}>{t('jobDetail.relatedJob')}</h3>
        <div className={style['related-jobs__list']}>
          {currentJobs.map((job) => (
            <div
              key={job._id}
              className={style['related-jobs__item']}
              onClick={() => {
                handleJobClick(job._id);
              }}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}/images/company/${job.company.logo}`}
                alt={`${job.company.name} logo`}
                className={style['related-jobs__item-logo']}
              />

              <div className={style['related-jobs__details']}>
                <Tooltip title={job.name}>
                  <div className={`${style['related-jobs__item-title']} ${style.truncated}`}>{job.name}</div>
                </Tooltip>
                <p className={style['related-jobs__item-company']}>{job.company.name}</p>
                <p className={style['related-jobs__item-location']}>{job.location}</p>
              </div>

              <button className={style['related-jobs__group-btn-apply']} disabled={isJobExpired(job.endDate)}>
                {t('jobDetail.applyNow')}
              </button>
            </div>
          ))}
        </div>

        <div className={style['related-jobs__pagination']}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`${style['pagination-button']} ${currentPage === index + 1 ? style['active'] : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedJobs;
