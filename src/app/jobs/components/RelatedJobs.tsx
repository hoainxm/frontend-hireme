import React, { useEffect, useState } from 'react';
import { Job } from '../../jobs/model';
import { fetchJobBySkill } from '../api';
import style from './RelatedJobs.module.scss';
import FavoriteButton from './FavoriteButton';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';

interface RelatedJobsProps {
  skills: string[];
}

const RelatedJobs: React.FC<RelatedJobsProps> = ({ skills }) => {
  const [relatedJobs, setRelatedJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    const fetchRelatedJobs = async () => {
      try {
        const res = await fetchJobBySkill(skills);
        if (res.data.statusCode === 201) {
          setRelatedJobs(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching related jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedJobs();
  }, [skills]);

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (!relatedJobs || relatedJobs.length === 0) {
    return <div>{t('noData')}</div>;
  }

  const isJobExpired = (endDate: string): boolean => {
    return dayjs(endDate).isBefore(dayjs(), 'day');
  };

  const handleJobClick = (jobId: string) => {
    history.push(`/jobs/${jobId}`);

    const scrollToTop = () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 8);
      }
    };

    scrollToTop();
  };

  return (
    <div className={style['related-jobs-container']}>
      <div className={style['related-jobs']}>
        <h3 className={style['related-jobs__title']}>Việc làm liên quan</h3>
        <div className={style['related-jobs__list']}>
          {relatedJobs.map((job) => (
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
                <div className={style['related-jobs__item-title']}>{job.name}</div>
                <p className={style['related-jobs__item-company']}>{job.company.name}</p>
                <p className={style['related-jobs__item-location']}>{job.location}</p>
              </div>
              <div className={style['related-jobs__group-btn']}>
                <button className={style['related-jobs__group-btn-apply']} disabled={isJobExpired(job.endDate)}>
                  {t('jobDetail.applyNow')}
                </button>
                <FavoriteButton job={job} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedJobs;
