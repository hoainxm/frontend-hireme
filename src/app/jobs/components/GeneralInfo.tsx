import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faClock, faUsers, faBriefcase, faTransgender } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import style from './GeneralInfo.module.scss';
import { Job } from '../model';

interface GeneralInfoProps {
  job: Job;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ job }) => {
  const { t } = useTranslation();

  return (
    <div className={style['general-info']}>
      <h4 className={style['general-info__title']}>{t('jobDetail.commonInfo')}</h4>
      <div className={style['general-info__item']}>
        <FontAwesomeIcon icon={faUserTie} className={style['general-info__item-icon']} />
        <div className={style['general-info__item-text-group']}>
          <span className={style['general-info__item-label']}>{t('jobDetail.level')}</span>
          <span className={style['general-info__item-value']}>{job.level}</span>
        </div>
      </div>
      <div className={style['general-info__item']}>
        <FontAwesomeIcon icon={faClock} className={style['general-info__item-icon']} />
        <div className={style['general-info__item-text-group']}>
          <span className={style['general-info__item-label']}>{t('jobDetail.experience')}</span>
          <span className={style['general-info__item-value']}>
            {job.experience} {t('jobDetail.years')}
          </span>
        </div>
      </div>
      <div className={style['general-info__item']}>
        <FontAwesomeIcon icon={faUsers} className={style['general-info__item-icon']} />
        <div className={style['general-info__item-text-group']}>
          <span className={style['general-info__item-label']}>{t('jobDetail.quantity')}</span>
          <span className={style['general-info__item-value']}>
            {job.quantity} {t('jobDetail.people')}
          </span>
        </div>
      </div>
      <div className={style['general-info__item']}>
        <FontAwesomeIcon icon={faBriefcase} className={style['general-info__item-icon']} />
        <div className={style['general-info__item-text-group']}>
          <span className={style['general-info__item-label']}>{t('jobDetail.employmentType')}</span>
          <span className={style['general-info__item-value']}>{job.workForm.join(', ')}</span>
        </div>
      </div>
      <div className={style['general-info__item']}>
        <FontAwesomeIcon icon={faTransgender} className={style['general-info__item-icon']} />
        <div className={style['general-info__item-text-group']}>
          <span className={style['general-info__item-label']}>{t('jobDetail.gender')}</span>
          <span className={style['general-info__item-value']}>{job.gender === '' ? t('jobDetail.noRequirement') : job.gender}</span>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
