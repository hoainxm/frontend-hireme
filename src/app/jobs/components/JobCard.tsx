import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faMapMarkerAlt, faHourglass, faCalendarAlt, faExclamationCircle, faEye } from '@fortawesome/free-solid-svg-icons';
import style from './JobCard.module.scss';
import { useTranslation } from 'react-i18next';
import FavoriteButton from '../components/FavoriteButton';
import dayjs from 'dayjs';
import { Job } from '../model';
import ApplyButton from '../applyButton/ApplyButton';
import { RootState, useAppSelector } from '../../../store/store';
import { Modal } from 'antd';
import AppliedCandidates from './AppliedCandidates';
import ModalSendJob from './ModalSendJob';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { t } = useTranslation();
  const isJobExpired = (endDate: string): boolean => {
    return dayjs(endDate).isBefore(dayjs(), 'day');
  };
  const userLogin = useAppSelector((state: RootState) => state.user);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<string>();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    setIsVerified(userLogin.userProfile?.isPremium);
  }, []);

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
          <AppliedCandidates job={job} />
        </div>

        <div className={style['job-card__action-buttons']}>
          {isJobExpired(job.endDate) ? (
            <button className={style['job-card__action-buttons__expired-button']}>
              <FontAwesomeIcon icon={faExclamationCircle} /> {t('jobDetail.expiredDeadline')}
            </button>
          ) : (
            <ApplyButton jobName={job.name} companyId={job.company._id} jobId={job._id} />
          )}
          <FavoriteButton job={job} />
        </div>
      </div>

      <div className={style['job-card__lower-block']}>
        <div className={style['job-card__description-header-wrapper']}>
          <h4 className={style['job-card__description-header']}>{t('jobDetail.jobDescription')}</h4>
          <button className={style['similar-job-button']} onClick={handleOpenModal}>
            <span className={style['similar-job-icon']}>🔔</span> {t('jobDetail.similarJobs')}
          </button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: job.description }} />
      </div>

      <ModalSendJob visible={isModalVisible} onClose={handleCloseModal} />
    </div>
  );
};

export default JobCard;
