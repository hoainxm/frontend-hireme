import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faMapMarkerAlt, faHourglass, faCalendarAlt, faPaperPlane, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import style from './JobCard.module.scss';
import { useTranslation } from 'react-i18next';
import FavoriteButton from '../components/FavoriteButton';
import dayjs from 'dayjs';
import { Job } from '../model';
import ApplyButton from '../applyButton/ApplyButton';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { t } = useTranslation();
  console.log('check job:', job);
  const isJobExpired = (endDate: string): boolean => {
    return dayjs(endDate).isBefore(dayjs(), 'day');
  };

  return (
    <div className={style['job-card']}>
      <div className={style['job-card__upper-block']}>
        <div className={style['job-card__header']}>
          <h2 className={style['job-card__title']}>{job.name}</h2>
        </div>

        <div className={style['job-card__details-container']}>
          <div className={style['job-card__details-container-item']}>
            <FontAwesomeIcon icon={faDollarSign} className={style['job-card__details-container-icon']} />
            <span className={style['job-card__details-container-text']}>{job.salary.toLocaleString()} VND</span>
          </div>
          <div className={style['job-card__details-container-item']}>
            <FontAwesomeIcon icon={faMapMarkerAlt} className={style['job-card__details-container-icon']} />
            <span className={style['job-card__details-container-text']}>{job.location}</span>
          </div>
          <div className={style['job-card__details-container-item']}>
            <FontAwesomeIcon icon={faHourglass} className={style['job-card__details-container-icon']} />
            <span className={style['job-card__details-container-text']}>{job.level}</span>
          </div>
        </div>

        <div className={style['job-card__sub-details']}>
          <span className={style['job-card__sub-details-title']}>
            <FontAwesomeIcon icon={faCalendarAlt} className={style['job-card__sub-details-icon']} />
            {t('timeApplicationJob')} {dayjs(job.endDate).format('DD/MM/YYYY')}
          </span>
        </div>

        {/* <div className={style['job-card__action-buttons']}>
          {isJobExpired(job.endDate) ? (
            <button className={style['job-card__action-buttons-expired-button']}>
              <FontAwesomeIcon icon={faExclamationCircle} /> {t('jobDetail.expiredDeadline')}
            </button>
          ) : (
            <button className={style['job-card__action-buttons-apply-button']}>
              <FontAwesomeIcon icon={faPaperPlane} /> {t('jobDetail.applyNow')}
            </button>
          )}
          <FavoriteButton job={job} />
        </div> */}

        <div className={style['job-card__action-buttons']}>
          {isJobExpired(job.endDate) ? (
            <button className={`${style.button} ${style['button--expired']}`}>
              <FontAwesomeIcon icon={faExclamationCircle} /> {t('jobDetail.expiredDeadline')}
            </button>
          ) : (
            <ApplyButton jobname={job.name} />
          )}
          <FavoriteButton job={job} />
        </div>
      </div>

      <div className={style['job-card__lower-block']}>
        <div className={style['job-card__description-header-wrapper']}>
          <h4 className={style['job-card__description-header']}>{t('jobDetail.jobDescription')}</h4>
        </div>
        <div dangerouslySetInnerHTML={{ __html: job.description }} />
      </div>
    </div>
  );
};

export default JobCard;
