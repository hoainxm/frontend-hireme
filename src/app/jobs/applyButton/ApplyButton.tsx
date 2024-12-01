import React, { useEffect, useState } from 'react';
import ApplyJobModal from '../ApplyJobModal';
import { useTranslation } from 'react-i18next';
import style from '../ApplyJobModal.module.scss';
import useLoginAlert from '@hooks/useLoginAlert';
import useVerificationAlert from '@hooks/useVerificationAlert';
import { RootState, useAppSelector } from '../../../store/store';

interface ApplyButtonProps {
  jobName: string;
  companyId: string;
  jobId: string;
  disabled?: boolean;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({ jobName, companyId, jobId, disabled }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>();
  const { t } = useTranslation();
  const { isLoginRequired } = useLoginAlert();
  const { isVerificationRequired } = useVerificationAlert();
  const userLogin = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    setIsVerified(userLogin.userProfile?.isVerify);
  }, []);

  const handleOpenModal = () => {
    if (!isLoggedIn) {
      isLoginRequired();
      return;
    }

    if (!isVerified) {
      isVerificationRequired();
      return;
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => setIsModalVisible(false);

  return (
    <>
      <button onClick={handleOpenModal} disabled={disabled} className={style['apply-button']}>
        {t('btn.applyNow')}
      </button>
      {isModalVisible && <ApplyJobModal jobName={jobName} companyId={companyId} jobId={jobId} onClose={handleCloseModal} disabled={disabled} />}
    </>
  );
};

export default ApplyButton;
