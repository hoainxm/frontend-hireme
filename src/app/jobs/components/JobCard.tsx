import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign,
  faMapMarkerAlt,
  faHourglass,
  faCalendarAlt,
  faPaperPlane,
  faHeart,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import style from './JobCard.module.scss';
import { useTranslation } from 'react-i18next';
import FavoriteButton from '../components/FavoriteButton';
import dayjs from 'dayjs';
import { Job } from '../model';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { t } = useTranslation();

  const isJobExpired = (endDate: string): boolean => {
    return dayjs(endDate).isBefore(dayjs(), 'day');
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h2 className={style.title}>{job.name}</h2>
      </div>

      <div className={style.detailsContainer}>
        <div className={style.detailItem}>
          <FontAwesomeIcon icon={faDollarSign} className={style.icon} />
          <span className={style.detailText}>{job.salary.toLocaleString()} VND</span>
        </div>
        <div className={style.detailItem}>
          <FontAwesomeIcon icon={faMapMarkerAlt} className={style.icon} />
          <span className={style.detailText}>{job.location}</span>
        </div>
        <div className={style.detailItem}>
          <FontAwesomeIcon icon={faHourglass} className={style.icon} />
          <span className={style.detailText}>{job.level}</span>
        </div>
      </div>

      <div className={style.subDetails}>
        <span className={style.subDetailTitle}>
          {' '}
          <FontAwesomeIcon icon={faCalendarAlt} className={style.subIcon} />
          Hạn nộp hồ sơ: {dayjs(job.endDate).format('DD/MM/YYYY')}
        </span>
      </div>

      <div className={style.actionButtons} style={{ marginBottom: '30px' }}>
        {isJobExpired(job.endDate) ? (
          <button className={style.expiredButton}>
            <FontAwesomeIcon icon={faExclamationCircle} /> {t('jobDetail.expiredDeadline')}
          </button>
        ) : (
          <button className={style.applyButton}>
            <FontAwesomeIcon icon={faPaperPlane} /> {t('jobDetail.applyNow')}
          </button>
        )}
        <button className={style.saveButton}>
          <FavoriteButton job={job} />
        </button>
      </div>

      <div dangerouslySetInnerHTML={{ __html: job.description }} />
    </div>
  );
};

export default JobCard;
