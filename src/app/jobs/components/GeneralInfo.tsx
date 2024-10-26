import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faClock, faUsers, faBriefcase, faTransgender } from '@fortawesome/free-solid-svg-icons';
import style from './GeneralInfo.module.scss';
import { Job } from '../model';

interface GeneralInfoProps {
  job: Job;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ job }) => {

  return (
    <div className={style['general-info']}>
      <h4 className={style['general-info__title']}>Thông tin chung</h4>
      <div className={style['general-info__item']}>
        <FontAwesomeIcon icon={faUserTie} className={style['general-info__item-icon']} />
        <div className={style['general-info__item-text-group']}>
          <span className={style['general-info__item-label']}>Cấp bậc</span>
          <span className={style['general-info__item-value']}>{job.level}</span>
        </div>
      </div>
      <div className={style['general-info__item']}>
        <FontAwesomeIcon icon={faClock} className={style['general-info__item-icon']} />
        <div className={style['general-info__item-text-group']}>
          <span className={style['general-info__item-label']}>Kinh nghiệm</span>
          <span className={style['general-info__item-value']}>{job.experience} năm</span>
        </div>
      </div>
      <div className={style['general-info__item']}>
        <FontAwesomeIcon icon={faUsers} className={style['general-info__item-icon']} />
        <div className={style['general-info__item-text-group']}>
          <span className={style['general-info__item-label']}>Số lượng tuyển</span>
          <span className={style['general-info__item-value']}>{job.quantity} người</span>
        </div>
      </div>
      <div className={style['general-info__item']}>
        <FontAwesomeIcon icon={faBriefcase} className={style['general-info__item-icon']} />
        <div className={style['general-info__item-text-group']}>
          <span className={style['general-info__item-label']}>Hình thức làm việc</span>
          <span className={style['general-info__item-value']}>{job.workForm.join(', ')}</span>
        </div>
      </div>
      <div className={style['general-info__item']}>
        <FontAwesomeIcon icon={faTransgender} className={style['general-info__item-icon']} />
        <div className={style['general-info__item-text-group']}>
          <span className={style['general-info__item-label']}>Giới tính</span>
          <span className={style['general-info__item-value']}>{job.gender === '' ? 'Không bắt buộc' : job.gender}</span>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
