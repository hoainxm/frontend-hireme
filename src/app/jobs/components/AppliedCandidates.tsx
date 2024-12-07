import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from '../components/JobCard.module.scss';
import { RootState, useAppSelector } from '../../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Job } from '../model';
import useUpgradeAlert from '@hooks/useUpgradeAlert';

interface AppliedCandidatesProps {
  job: Job;
}

const AppliedCandidates: React.FC<AppliedCandidatesProps> = ({ job }) => {
  const { isUpgradeRequired } = useUpgradeAlert();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>();
  const { t } = useTranslation();
  const userLogin = useAppSelector((state: RootState) => state.user);
  const [upgradePacket, setUpgradePacket] = useState<string | null>(null);

  console.log(upgradePacket);
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUpgradePacket = localStorage.getItem('aXNfcHJlbWl1bV9zZWN0aW9u');
    setIsLoggedIn(!!token);
    setIsVerified(userLogin.userProfile?.isVerify);
    setUpgradePacket(storedUpgradePacket);
  }, []);

  const renderAppliedCandidates = () => {
    if (upgradePacket === 'bGl0ZQ==' || upgradePacket == null) {
      return (
        <div onClick={isUpgradeRequired} className={style['job-card__sub-details-title']}>
          <FontAwesomeIcon icon={faEye} className={style['job-card__sub-details-icon']} />
          <span>{t('appliedCandidatesButton')}</span>
        </div>
      );
    } else {
      return (
        <div className={style['job-card__sub-details-title']}>
          <FontAwesomeIcon icon={faEye} className={style['job-card__sub-details-icon']} />
          <span>
            {job.appliedCandidates} {t('appliedCandidates')}
          </span>
        </div>
      );
    }
  };

  if (!isLoggedIn && !isVerified) {
    return null;
  }

  return <>{renderAppliedCandidates()}</>;
};

export default AppliedCandidates;
