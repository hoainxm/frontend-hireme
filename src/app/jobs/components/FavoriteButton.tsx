import React, { useEffect, useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Job } from '../model';

interface SaveJobButtonProps {
  job: Job;
}

const SaveJobButton: React.FC<SaveJobButtonProps> = ({ job }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const jobIsSaved = savedJobs.some((savedJob: Job) => savedJob._id === job._id);
    setIsSaved(jobIsSaved);
  }, [job._id]);

  const saveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (!savedJobs.some((savedJob: Job) => savedJob._id === job._id)) {
      savedJobs.push(job);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      setIsSaved(true);
    }
  };

  const unsaveJob = () => {
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    savedJobs = savedJobs.filter((savedJob: Job) => savedJob._id !== job._id);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    setIsSaved(false);
  };

  return (
    <button
      type='button'
      aria-label={isSaved ? 'Unsave job' : 'Save job'}
      onClick={isSaved ? unsaveJob : saveJob}
      style={{
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '20px',
      }}
    >
      {isSaved ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
    </button>
  );
};

export default SaveJobButton;
