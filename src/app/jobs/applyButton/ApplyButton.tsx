import React, { useState } from 'react';
import ApplyJobModal from '../ApplyJobModal';

interface ApplyButtonProps {
  jobName: string;
  companyId: string;
  jobId: string;
  disabled?: boolean;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({ jobName, companyId, jobId, disabled }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  return (
    <>
      <button onClick={handleOpenModal} disabled={disabled}>
        Apply Now
      </button>
      {isModalVisible && <ApplyJobModal jobName={jobName} companyId={companyId} jobId={jobId} onClose={handleCloseModal} disabled={disabled} />}
    </>
  );
};

export default ApplyButton;
