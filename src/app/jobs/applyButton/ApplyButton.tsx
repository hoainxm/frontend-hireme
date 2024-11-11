import React, { useState } from 'react';
import ApplyJobModal from '../ApplyJobModal';
import { useTranslation } from 'react-i18next';
import style from '../ApplyJobModal.module.scss';

interface ApplyButtonProps {
  jobName: string;
  companyId: string;
  jobId: string;
  disabled?: boolean;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({ jobName, companyId, jobId, disabled }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t } = useTranslation();
  const handleOpenModal = () => setIsModalVisible(true);
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
