import React, { useEffect, useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Job } from '../model';
import style from '../jobs.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FavoriteButtonProps {
  job: Job;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ job }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const jobIsSaved = savedJobs.some((savedJob: Job) => savedJob._id === job._id);
    setIsSaved(jobIsSaved);
  }, [job._id]);

  const saveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (!savedJobs.some((savedJob: Job) => savedJob._id === job._id)) {
      savedJobs.push(job);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      setIsSaved(true);
      toast.success(`You have saved the job: ${job.name}`);
    }
  };

  const unsaveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    savedJobs = savedJobs.filter((savedJob: Job) => savedJob._id !== job._id);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    setIsSaved(false);
    toast.success(`You have unsaved the job: ${job.name}`);
  };

  return (
    <>
      <div className={style.btnHeart} aria-label={isSaved ? 'Unsave job' : 'Save job'} onClick={isSaved ? unsaveJob : saveJob}>
        {isSaved ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
      </div>
    </>
  );
};

export default FavoriteButton;
